import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import StrokeIpld from '../../icons/StrokeIpld'
import { useExplore } from '../../providers/explore.tsx'

const IpldExploreForm = ({ t }) => {
  const [path, setPath] = useState('')
  const [showEmptyError, setShowEmptyError] = useState(false)
  const { doExploreUserProvidedPath } = useExplore()

  const handleOnSubmit = (evt) => {
    evt.preventDefault()
    if (path.trim().length === 0) {
      setShowEmptyError(true)
      return
    }
    doExploreUserProvidedPath(path)
  }

  const handleOnChange = (evt) => {
    const newPath = evt.target.value
    if (showEmptyError && newPath.length > 0) {
      setShowEmptyError(false)
    }
    setPath(newPath)
  }

  const outline = showEmptyError ? '2px solid red' : ''
  const placeholder = showEmptyError ? 'QmHash can not be empty' : 'QmHash'

  return (
    <form data-id='IpldExploreForm' className='sans-serif black-80 flex' onSubmit={handleOnSubmit}>
      <div className='flex-auto'>
        <div className='relative'>
          <input
            id='ipfs-path'
            className='input-reset bn pa2 mb2 db w-100 f6 br-0 placeholder-light focus-outline'
            style={{ borderRadius: '3px 0 0 3px', outline }}
            type='text'
            placeholder={placeholder}
            aria-describedby='name-desc'
            onChange={handleOnChange}
            value={path}
          />
          <small id='ipfs-path-desc' className='o-0 absolute f6 black-60 db mb2'>Paste in a CID or IPFS path</small>
        </div>
      </div>
      <div className='flex-none'>
        <button
          type='submit'
          className='button-reset dib lh-copy pv1 pl2 pr3 ba f7 fw4 focus-outline white bg-aqua bn cursor-pointer'
          style={{ borderRadius: '0 3px 3px 0' }}
        >
          <StrokeIpld style={{ height: 24 }} className='dib fill-current-color v-mid navy 0-100' />
          <span className='ml2 navy 0-100'>{t('IpldExploreForm.explore')}</span>
        </button>
      </div>
    </form>
  )
}

export default withTranslation('explore')(IpldExploreForm)
