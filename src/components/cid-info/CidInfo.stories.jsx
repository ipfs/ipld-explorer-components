import React from 'react'

import CidInfo from './CidInfo'
import i18n from '../../i18n-decorator'

export default {
  title: 'CID Info',
  decorators: [i18n]
}

export const CidV0DagPb = () => <CidInfo className="ma2" cid="QmYPNmahJAvkMTU6tDx5zvhEkoLzEFeTDz6azDCSNqzKkW" />

CidV0DagPb.story = {
  name: 'cid v0 dag-pb'
}

export const CidV1B32Raw = () => <CidInfo className="ma2" cid="zb2rhZMC2PFynWT7oBj7e6BpDpzge367etSQi6ZUA81EVVCxG" />

CidV1B32Raw.story = {
  name: 'cid v1 b32 raw'
}

export const CidV1B32DagPb = () => (
    <CidInfo className="ma2" cid="bafybeihj5nwgbaan7eh4ryrx5vjsi3zzn2dvpgv2ibvku6lwublilhxcfu" />
)

CidV1B32DagPb.story = {
  name: 'cid v1 b32 dag-pb'
}

export const CidV1B36Peerid = () => (
    <CidInfo className="ma2" cid="k51qzi5uqu5dghizkp74wj83c9r36bqd8aq0pozpifb8bmkzrtlud8i7tralyo" />
)

CidV1B36Peerid.story = {
  name: 'cid v1 b36 peerid'
}

export const CidV1B58Sha3 = () => (
    <CidInfo
        className="ma2"
        cid="zB7NbGN5wyfSbNNNwo3smZczHZutiWERdvWuMcHXTj393RnbhwsHjrP7bPDRPA79YWPbS69cZLWXSANcwUMmk4Rp3hP9Y"
    />
)

CidV1B58Sha3.story = {
  name: 'cid v1 b58 sha3'
}

export const CidV1B58Blake2B512 = () => (
    <CidInfo
        className="ma2"
        cid="z4QM3CM1XM3U62Yf7KNUzBpMPrjTAdeKJnp75JNkRQGeYk15w1hFt2z4ayjP33dBwuqsGz54hH47FMKi7LQ6iRNh8i2gUKDt"
    />
)

CidV1B58Blake2B512.story = {
  name: 'cid v1 b58 blake2b-512'
}

export const CidError = () => <CidInfo className="ma2" cid="🚀" />

CidError.story = {
  name: 'cid error'
}

export const NoCid = () => <CidInfo />

NoCid.story = {
  name: 'no cid'
}
