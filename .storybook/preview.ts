import { type Preview } from '@storybook/react';
import { Buffer } from 'buffer'

globalThis.Buffer = Buffer

// import CSS files
import 'ipfs-css'
import 'react-virtualized/styles.css'
import 'tachyons'
import '../src/components/loader/Loader.css'
import '../src/components/object-info/LinksTable.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
