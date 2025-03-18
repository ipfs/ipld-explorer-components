import React from 'react'
import { useTranslation } from 'react-i18next'
import { useExplore } from '../../providers/explore'
import type IpldExploreError from '../../lib/errors'

export interface IpldExploreErrorComponentProps {
  error: IpldExploreError | null
}

const TroubleshootingTips: React.FC<{ cid: string }> = ({ cid }) => {
  const { t } = useTranslation('explore', { keyPrefix: 'errors' })
  if (cid == null) return null

  return (
    <>
      <div className='mt3'>
        <h4 className='ma0 mb2'>{t('troubleshootingTips.title')}</h4>
        <ul className='ma0 pl3'>
          <li>{t('troubleshootingTips.refresh')}</li>
          <li>{t('troubleshootingTips.checkConnection')}</li>
          <li>{t('troubleshootingTips.tryLater')}</li>
          <li>{t('troubleshootingTips.checkCidSyntax')}</li>
        </ul>
      </div>
      <div className='mt2'>
        <a
          href={`https://check.ipfs.network/?cid=${cid}`}
          target="_blank"
          rel="noopener noreferrer"
          className='red-dark hover-red underline'
        >
          {t('checkIpfsNetwork')}
        </a>
    </div>
    </>
  )
}

export function IpldExploreErrorComponent ({ error }: IpldExploreErrorComponentProps): JSX.Element | null {
  const { exploreState } = useExplore()
  const { path } = exploreState
  const [cid] = path?.split('/') ?? []
  const { t } = useTranslation('explore', { keyPrefix: 'errors' })
  if (error == null) return null

  // more self service
  return (
    <div className="flex justify-center w-100 pa3">
      <div className="bg-red-muted red-dark pa3 br2 lh-copy mw7">
        <div>{error.toString(t)}</div>
        <TroubleshootingTips cid={cid} />
      </div>
    </div>
  )
}
