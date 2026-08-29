import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, '.', '');

  if (mode === 'production') {
    const remoteFrontendUrl = env.VITE_REMOTE_FRONTEND_URL;

    if (!remoteFrontendUrl) {
      throw new Error('VITE_REMOTE_FRONTEND_URL is required for production builds');
    }

    if (new URL(remoteFrontendUrl).protocol !== 'https:') {
      throw new Error('VITE_REMOTE_FRONTEND_URL must use HTTPS for production builds');
    }
  }

  return {
    plugins: [react(), tsconfigPaths()],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent Vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
            protocol: 'ws',
            host,
            port: 1421,
          }
        : undefined,
      watch: {
        // 3. tell Vite to ignore watching `src-tauri`
        ignored: ['**/src-tauri/**'],
      },
    },
  };
});
