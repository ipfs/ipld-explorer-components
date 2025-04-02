import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import extractInfo, { type ExtractedInfo } from '../../lib/extract-info.js'
import { DocLink } from '../common/DocLink'

export interface CidInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  cid: string | null
}

export const CidInfo: React.FC<CidInfoProps> = ({ cid, className, ...props }) => {
  const { t } = useTranslation('explore')
  const [cidErr, setCidErr] = useState<Error | null>(null)
  const [cidInfo, setCidInfo] = useState<ExtractedInfo | null>(null)
  useEffect(() => {
    const asyncFn = async (): Promise<void> => {
      try {
        if (cid != null) {
          setCidInfo(await extractInfo(cid))
        }
      } catch (err: any) {
        console.error(err)
        setCidErr(err)
      }
    }
    void asyncFn()
  }, [cid])

  if (cid == null) {
    return null
  }

  return (
    <section className={`ph3 pv4 sans-serif ${className}`} {...props}>
      <label className='db pb2'>
        <DocLink term='cid' className='tracked ttu f5 fw2'>
          {t('CidInfo.header')}
        </DocLink>
      </label>
      {(cidInfo == null)
        ? null
        : (
        <div>
          <div className='f7 monospace fw4 ma0 pb2 truncate mid-gray force-select' title={cid.toString()}>
            {cid.toString()}
          </div>
          <div className='f6 sans-serif fw4 ma0 pb2 truncate' id='CidInfo-human-readable-cid'>
            {cidInfo.humanReadable}
          </div>
          <label htmlFor='CidInfo-human-readable-cid' className='db fw2 ma0 mid-gray ttu f7 tracked'>
            {t('base')} - {t('version')} - {t('codec')} - {t('multihash')}
          </label>
          <DocLink term='multihash' className='dib tracked ttu f6 fw2 mt4'>
            {t('multihash')}
          </DocLink>
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
                <DocLink term='multicodec' className='db orange no-underline pt2' title='Multicodec'>
                  <code className='gray'>0x</code>
                  <code>{cidInfo.hashFnCode}</code> = {cidInfo.hashFn}
                </DocLink>
                <div id='CidInfo-multihash' className='green'>
                  <code className='gray'>0x</code>
                  <code>{cidInfo.hashLengthCode}</code> = {cidInfo.hashLengthInBits} bits
                </div>
              </div>
            </div>
          </div>
        </div>
          )}
      {(cidErr == null)
        ? null
        : (
        <div>
          <div className='f5 sans-serif fw5 ma0 pv2 truncate navy'>
            {cid.toString()}
          </div>
          <div className='red fw2 ma0 f7'>{cidErr.message}</div>
        </div>
          )}
    </section>
  )
}

export default CidInfo
