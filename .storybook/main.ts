import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

import viteConfig from '../vite.config';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage',
    '@chromatic-com/storybook'
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // async viteFinal(config) {
  //   // Merge custom configuration into the default config
  //   return mergeConfig(config, viteConfig);
  // },
  typescript: {
    // reactDocgen: 'react-docgen-typescript'
    reactDocgen: false
    // reactDocgenTypescriptOptions: {

    // }
  },

  // docs: {}
};
export default config;
