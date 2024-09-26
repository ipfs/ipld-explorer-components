import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

import viteConfig from '../vite.config';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: { reactDocgen: 'react-docgen-typescript' },
  // async viteFinal(config) {
  //   // Merge custom configuration into the default config
  //   return mergeConfig(config, viteConfig);
  // },
};
export default config;
