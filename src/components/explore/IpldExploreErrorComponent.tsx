import React from 'react'
import { useTranslation } from 'react-i18next'

import type IpldExploreError from '../../lib/errors'

export interface IpldExploreErrorComponentProps {
  error?: IpldExploreError
}

export function IpldExploreErrorComponent ({ error }: IpldExploreErrorComponentProps): JSX.Element | null {
  const { t } = useTranslation('explore', { keyPrefix: 'errors' })
  if (error == null) return null

  return (
    <div className='bg-red white pa3 lh-copy'>
      <div>{error.toString(t)}</div>
    </div>
  )
}
