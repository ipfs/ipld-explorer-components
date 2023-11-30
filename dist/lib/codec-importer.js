import getCodecNameFromCode from './get-codec-name-from-code';
export default async function codecImporter(codeOrName) {
  let codecName;
  if (typeof codeOrName === 'string') {
    codecName = codeOrName;
  } else {
    codecName = getCodecNameFromCode(codeOrName);
  }

  // #WhenAddingNewCodec
  switch (codecName) {
    case 'dag-cbor':
      return import('@ipld/dag-cbor');
    case 'dag-pb':
      return import('@ipld/dag-pb');
    case 'git-raw':
      throw new Error('git-raw is unsupported until https://github.com/ipld/js-ipld-git is updated.');
    case 'raw':
      return import('multiformats/codecs/raw');
    case 'json':
      return import('multiformats/codecs/json');
    case 'dag-json':
      return import('@ipld/dag-json');
    case 'dag-jose':
      return import('dag-jose');
    default:
      throw new Error(`unsupported codec: ${codeOrName}=${codecName}`);
  }
}