import multicodecs from 'multicodec'

export default function getCodecNameFromCode (code: number): string {
  switch (code) {
    case multicodecs.DAG_CBOR:
      return 'dag-cbor'
    case multicodecs.DAG_PB:
      return 'dag-pb'
    case multicodecs.GIT_RAW:
      return 'git-raw'
    case multicodecs.RAW:
      return 'raw'
    case multicodecs.JSON:
      return 'json'
    case multicodecs.DAG_JSON:
      return 'dag-json'
    case multicodecs.DAG_JOSE:
      return 'dag-jose'
    default:
      // TODO: Remove dependency on multicodecs
      return multicodecs.codeToName[code as multicodecs.CodecCode]
  }
}
