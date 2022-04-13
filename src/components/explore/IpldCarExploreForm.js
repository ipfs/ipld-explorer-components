import React from 'react'
import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'
import StrokeIpld from '../../icons/StrokeIpld'

class IpldCarExploreForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      file: { }
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
  }

  handleOnSubmit (evt) {
    evt.preventDefault()
  }

  handleOnChange () {
    const selectedFile = document.getElementById('car-file').files[0]
    this.setState({ file: selectedFile })
    this.props.doUploadUserProvidedCar(selectedFile)
  }

  render () {
    const { t } = this.props
    return (
      <form data-id='IpldCarExploreForm' className='sans-serif black-80 flex' onSubmit={this.handleOnSubmit} encType='multipart/form-data'>
        <div className='flex-auto'>
          <div className='relative'>
            <input id='car-file' type='file' className='input-reset bn pa2 mb2 db w-100 f6 br-0 placeholder-light focus-outline' style={{ borderRadius: '3px 0 0 3px', backgroundColor: 'white', padding: '5px 0px 5px 5px', width: '99%' }} aria-describedby='name-desc' onChange={this.handleOnChange} />
            <small id='car-file-desc' className='o-0 absolute f6 black-60 db mb2'>{t('IpldCarExploreForm.uploadCarFile')}</small>
          </div>
        </div>
      </form>
    )
  }
}

export default connect(
  'doUploadUserProvidedCar',
  withTranslation('explore')(IpldCarExploreForm)
)
