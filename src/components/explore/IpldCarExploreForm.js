import React from 'react'
import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'
import StrokeIpld from '../../icons/StrokeIpld'
import { CarReader } from '@ipld/car'

class IpldCarExploreForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      path: '',
      file: { }
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
  }

  async handleOnSubmit (evt) {
    evt.preventDefault()

    // eslint-disable-next-line no-undef
    const reader = new FileReader()
    reader.readAsArrayBuffer(this.state.file)

    reader.onload = async () => {
      const carReader = await CarReader.fromBytes(reader.result)
      const roots = await carReader.getRoots()
      const got = await carReader.get(roots[0])
      this.setState({ path: got.cid.toString() })
      this.props.doExploreUserProvidedPath(this.state.path)
    }
  }

  handleOnChange () {
    const selectedFile = document.getElementById('car-file').files[0]
    this.setState({ file: selectedFile[0] })
  }

  render () {
    const { t } = this.props
    return (
      <form data-id='IpldCarExploreForm' className='sans-serif black-80 flex' onSubmit={this.handleOnSubmit} encType='multipart/form-data'>
        <div className='flex-auto'>
          <div className='relative'>
            <input id='car-file' type='file' className='input-reset bn pa2 mb2 db w-100 f6 br-0 placeholder-light focus-outline' style={{ borderRadius: '3px 0 0 3px' }} placeholder='QmHash' aria-describedby='name-desc' onChange={this.handleOnChange} />
            <small id='car-file-desc' className='o-0 absolute f6 black-60 db mb2'>Upload CAR file</small>
          </div>
        </div>
        <div className='flex-none'>
          <button
            type='submit'
            className='button-reset dib lh-copy pv1 pl2 pr3 ba f7 fw4 focus-outline white bg-aqua bn'
            style={{ borderRadius: '0 3px 3px 0' }}
          >
            <StrokeIpld style={{ height: 24 }} className='dib fill-current-color v-mid' />
            <span className='ml2'>{t('IpldCarExploreForm.explore')}</span>
          </button>
        </div>
      </form>
    )
  }
}

export default connect(
  'doExploreUserProvidedCar',
  'doExploreUserProvidedPath',
  withTranslation('explore')(IpldCarExploreForm)
)
