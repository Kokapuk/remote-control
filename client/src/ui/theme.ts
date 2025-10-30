import { defineConfig, createSystem, defaultConfig } from '@chakra-ui/react';

const config = defineConfig({
  globalCss: {
    html: {
      colorPalette: 'teal',
    },
  },
});

const theme = createSystem(defaultConfig, config);

export default theme;
