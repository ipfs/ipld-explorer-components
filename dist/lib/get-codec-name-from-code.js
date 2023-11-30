/**
 * Converts supported codec codes from https://github.com/multiformats/multicodec/blob/master/table.csv to their names.
 */
export default function getCodecNameFromCode(code) {
  // #WhenAddingNewCodec
  switch (code) {
    case 113:
      return 'dag-cbor';
    case 112:
      return 'dag-pb';
    case 120:
      return 'git-raw';
    case 85:
      return 'raw';
    case 512:
      return 'json';
    case 297:
      return 'dag-json';
    case 133:
      return 'dag-jose';
    default:
      return `codec code ${code}=unknown`;
  }
}