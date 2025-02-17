import React from 'react'
import { useTranslation } from 'react-i18next'
import { BlockFetchTimeoutError } from '../../lib/errors'
import type IpldExploreError from '../../lib/errors'

export interface IpldExploreErrorComponentProps {
  error: IpldExploreError | null
}

export function IpldExploreErrorComponent ({ error }: IpldExploreErrorComponentProps): JSX.Element | null {
  const { t } = useTranslation('explore', { keyPrefix: 'errors' })
  if (error == null) return null

  const isBlockError = error instanceof BlockFetchTimeoutError

  return (
    <div className='bg-red white pa3 lh-copy'>
      <div>{error.toString(t)}</div>
      {isBlockError && (
        <div className='mt2'>
          <a
            href={`https://check.ipfs.network/#/ipfs/${error.cid ?? ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className='white underline hover-white'
          >
            {t('checkIpfsNetwork')}
          </a>
        </div>
      )}
    </div>
  )
}
