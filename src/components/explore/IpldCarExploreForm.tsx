import React, { useCallback, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useExplore } from '../../providers/explore.jsx'
import { useHelia } from '../../providers/helia.jsx'
import spinnerImage from './spinner.svg'
import uploadImage from './upload.svg'

export const IpldCarExploreForm: React.FC = () => {
  const { t } = useTranslation('explore')
  // const [file, setFile] = useState({})
  const { doUploadUserProvidedCar } = useExplore()
  const { selectHeliaReady } = useHelia()

  const handleOnSubmit = (evt: FormEvent<HTMLFormElement>): void => {
    evt.preventDefault()
  }

  const handleOnChange = useCallback((evt: ChangeEvent<HTMLInputElement>): void => {
    // Change the state.
    const imageFileLoader = document.getElementById('car-loader-image') as HTMLImageElement | null
    if (imageFileLoader == null) {
      console.error('cannot find element with id "car-loader-image"')
      return
    }
    imageFileLoader.src = spinnerImage

    // Get the file, upload car.
    const carFileInputEl = document.getElementById('car-file') as HTMLInputElement | null
    if (carFileInputEl == null) {
      console.error('cannot find element with id "car-file"')
      return
    }
    const selectedFile = carFileInputEl.files?.[0]
    if (selectedFile == null) {
      console.error('no file selected')
      return
    }
    void doUploadUserProvidedCar(selectedFile, uploadImage)
  }, [doUploadUserProvidedCar])

  return (
    <form data-id='IpldCarExploreForm' className='sans-serif black-80 flex' onSubmit={handleOnSubmit} encType='multipart/form-data'>
      <div className='flex-auto'>
        <div className='relative'>
          <input
            id='car-file'
            type='file'
            accept='.car'
            className='input-reset bn pa2 mb2 db w-100 f6 br-0 placeholder-light focus-outline'
            style={{ borderRadius: '3px 0 0 3px', backgroundColor: 'white', padding: '5px 0px 5px 5px', width: '99%' }}
            aria-describedby='name-desc'
            onChange={handleOnChange}
            disabled={!selectHeliaReady()}
          />
          <small id='car-file-desc' className='o-0 absolute f6 black-60 db mb2'>{t('IpldCarExploreForm.uploadCarFile')}</small>
          <img
            id='car-loader-image'
            alt='placeholder for upload and loader'
            src={uploadImage}
            className='absolute'
            style={{ top: '0px', right: '0px', height: '30px', width: '30px', paddingRight: '10px' }}
          />
        </div>
      </div>
    </form>
  )
}

export default IpldCarExploreForm
