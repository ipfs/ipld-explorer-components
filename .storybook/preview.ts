import { type Preview } from '@storybook/react';
import { Buffer } from 'buffer'

globalThis.Buffer = Buffer

// import CSS files
import 'ipfs-css'
import 'tachyons'

const preview: Preview = {
  // tags: ['autodocs']
};

export default preview;
