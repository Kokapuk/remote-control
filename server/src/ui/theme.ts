import { defineConfig, createSystem, defaultConfig } from '@chakra-ui/react';

const config = defineConfig({
  globalCss: {
    html: {
      colorPalette: 'teal',
      background: 'transparent',
    },
  },
});

const theme = createSystem(defaultConfig, config);

export default theme;
