import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'

import extractInfo from '../../lib/extract-info'

export const CidInfo = ({ t, tReady, cid, className, ...props }) => {
  const [cidErr, setCidErr] = useState(null)
  const [cidInfo, setCidInfo] = useState(null)
  useEffect(() => {
    const asyncFn = async () => {
      try {
        if (cid) {
          setCidInfo(await extractInfo(cid))
        }
      } catch (err) {
        console.error(err)
        setCidErr(err)
      }
    }
    asyncFn()
  }, [cid])

  return !cid
    ? null
    : (
    <section className={`ph3 pv4 sans-serif ${className}`} {...props}>
      <label className='db pb2'>
        <a className='tracked ttu f5 fw2 teal-muted hover-aqua link' href='https://docs.ipfs.io/concepts/glossary/#cid' rel='external' target='_external'>
          {t('CidInfo.header')}
        </a>
      </label>
      {!cidInfo
        ? null
        : (
        <div>
          <div className='f7 monospace fw4 ma0 pb2 truncate mid-gray force-select' title={cid}>
            {cid}
          </div>
          <div className='f6 sans-serif fw4 ma0 pb2 truncate' id='CidInfo-human-readable-cid'>
            {cidInfo.humanReadable}
          </div>
          <label htmlFor='CidInfo-human-readable-cid' className='db fw2 ma0 mid-gray ttu f7 tracked'>
            {t('base')} - {t('version')} - {t('codec')} - {t('multihash')}
          </label>
          <a
            href='https://docs.ipfs.io/concepts/glossary/#multihash' rel='external' target='_external'
            className='dib tracked ttu f6 fw2 teal-muted hover-aqua link mt4'
          >
            {t('multihash')}
          </a>
          <div>
            <div className='dib monospace f6 pt2 tr dark-gray lh-title ph2'>
              <code className='gray'>0x</code>
              <span className='orange force-select'>{cidInfo.hashFnCode}</span>
              <span className='green force-select'>{cidInfo.hashLengthCode}</span>
              <span id='CidInfo-multihash' className='force-select'>
                {cidInfo.hashValueIn32CharChunks.map(chunk => (
                  <span key={chunk.join('')}>{chunk.join('')}<br /></span>
                ))}
              </span>
              <label htmlFor='CidInfo-multihash' className='sans-serif fw2 ma0 mid-gray ttu f7 tracked'>
                {t('CidInfo.hashDigest')}
              </label>
              <div className='tl lh-copy'>
                <a className='db orange no-underline pt2' href='https://docs.ipfs.io/concepts/glossary/#multicodec' rel='external' target='_external' title="Multicodec">
                  <code className='gray'>0x</code>
                  <code>{cidInfo.hashFnCode}</code> = {cidInfo.hashFn}
                </a>
                <div id='CidInfo-multihash' className='green'>
                  <code className='gray'>0x</code>
                  <code>{cidInfo.hashLengthCode}</code> = {cidInfo.hashLengthInBits} bits
                </div>
              </div>
            </div>
          </div>
        </div>
          )}
      {!cidErr
        ? null
        : (
        <div>
          <div className='f5 sans-serif fw5 ma0 pv2 truncate navy'>
            {cid}
          </div>
          <div className='red fw2 ma0 f7'>{cidErr.message}</div>
        </div>
          )}
    </section>
      )
}

export default withTranslation('explore')(CidInfo)
