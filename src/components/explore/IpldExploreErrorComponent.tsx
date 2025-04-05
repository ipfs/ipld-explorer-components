import React from 'react'
import { useTranslation } from 'react-i18next'
import { CARFetchError } from '../../lib/errors'
import { useExplore } from '../../providers/explore.js'
import type IpldExploreError from '../../lib/errors'
import type { ExploreState } from '../../providers/explore.js'

export interface IpldExploreErrorComponentProps {
  error: IpldExploreError | null
}

const CIDTroubleshootingTips: React.FC = () => {
  const { t } = useTranslation('explore', { keyPrefix: 'errors' })
  const { setExploreState } = useExplore()

  const handleClearError = (): void => {
    const hashSplit = window.location.hash.split('/')
    if (hashSplit.length > 2) {
      window.location.hash = '#/explore'
    }
    setExploreState((state: ExploreState) => ({ ...state, path: hashSplit.length > 2 ? '/' : state.path, error: null }))
  }

  return (
    <>
      <div className='mt3'>
        <h4 className='ma0 mb2'>{t('troubleshootingTips.title')}</h4>
        <ul className='ma0 pl3'>
          <li>{t('troubleshootingTips.checkCarFormat')}</li>
          <li>{t('troubleshootingTips.tryDifferentCar')}</li>
        </ul>
      </div>
      <div className='mt2'>
        <button
          onClick={handleClearError}
          className='red-dark hover-white underline pointer bg-transparent bn'
        >
          {t('clearError')}
        </button>
      </div>
    </>
  )
}

export function IpldExploreErrorComponent ({ error }: IpldExploreErrorComponentProps): JSX.Element | null {
  const { t } = useTranslation('explore', { keyPrefix: 'errors' })
  if (error == null) return null

  return <div className="flex justify-center w-100 pa3">
  <div className="bg-red-muted red-dark pa3 br2 lh-copy mw7">
    <div>{error.toString(t)}</div>
    {error instanceof CARFetchError
      ? <CIDTroubleshootingTips />
      : null}
  </div>
</div>
}
