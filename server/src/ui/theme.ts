import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  globalCss: {
    '*': {
      scrollbarWidth: 'thin',
      scrollbarColor: 'color-mix(in srgb, var(--chakra-colors-fg), transparent 85%) transparent',
    },
    html: {
      colorPalette: 'teal',
      background: 'transparent',
    },
  },
});

const theme = createSystem(defaultConfig, config);

export default theme;
