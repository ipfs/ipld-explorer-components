import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'redux-bundler-react';
import spinnerImage from './spinner.svg';
import uploadImage from './upload.svg';
class IpldCarExploreForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {}
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }
  handleOnSubmit(evt) {
    evt.preventDefault();
  }
  handleOnChange() {
    //  Change the state.
    const imageFileLoader = document.getElementById('car-loader-image');
    imageFileLoader.src = spinnerImage;

    //  Get the file, upload car.
    const selectedFile = document.getElementById('car-file').files[0];
    this.props.doUploadUserProvidedCar(selectedFile, uploadImage);
  }
  render() {
    const {
      t
    } = this.props;
    return /*#__PURE__*/React.createElement("form", {
      "data-id": "IpldCarExploreForm",
      className: "sans-serif black-80 flex",
      onSubmit: this.handleOnSubmit,
      encType: "multipart/form-data"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex-auto"
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("input", {
      id: "car-file",
      type: "file",
      accept: ".car",
      className: "input-reset bn pa2 mb2 db w-100 f6 br-0 placeholder-light focus-outline",
      style: {
        borderRadius: '3px 0 0 3px',
        backgroundColor: 'white',
        padding: '5px 0px 5px 5px',
        width: '99%'
      },
      "aria-describedby": "name-desc",
      onChange: this.handleOnChange
    }), /*#__PURE__*/React.createElement("small", {
      id: "car-file-desc",
      className: "o-0 absolute f6 black-60 db mb2"
    }, t('IpldCarExploreForm.uploadCarFile')), /*#__PURE__*/React.createElement("img", {
      id: "car-loader-image",
      alt: "placeholder for upload and loader",
      src: uploadImage,
      className: "absolute",
      style: {
        top: '0px',
        right: '0px',
        height: '30px',
        width: '30px',
        paddingRight: '10px'
      }
    }))));
  }
}
export default connect('doUploadUserProvidedCar', withTranslation('explore')(IpldCarExploreForm));