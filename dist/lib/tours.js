import React from 'react';
export const projectsTour = {
  getSteps: _ref => {
    let {
      t
    } = _ref;
    return [{
      content: /*#__PURE__*/React.createElement("div", {
        className: "montserrat charcoal"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "f3 fw4"
      }, t('tour.projects.title')), /*#__PURE__*/React.createElement("p", {
        className: "tl f6"
      }, t('tour.projects.paragraph1'))),
      placement: 'center',
      target: 'body'
    }];
  },
  styles: {
    options: {
      width: '500px',
      primaryColor: '#69c4cd',
      textColor: '#34373f',
      zIndex: 999
    }
  }
};
export const explorerTour = {
  getSteps: _ref2 => {
    let {
      t
    } = _ref2;
    return [{
      content: /*#__PURE__*/React.createElement("div", {
        className: "montserrat charcoal"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "f3 fw4"
      }, t('tour.explorer.step1.title')), /*#__PURE__*/React.createElement("p", {
        className: "tl f6"
      }, t('tour.explorer.step1.paragraph1'))),
      placement: 'center',
      target: 'body'
    }, {
      content: /*#__PURE__*/React.createElement("div", {
        className: "montserrat charcoal"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "f3 fw4"
      }, t('tour.explorer.step2.title')), /*#__PURE__*/React.createElement("p", {
        className: "tl f6"
      }, t('tour.explorer.step2.paragraph1')), /*#__PURE__*/React.createElement("p", {
        className: "tl f6"
      }, t('tour.explorer.step2.paragraph2'))),
      placement: 'bottom',
      target: '.joyride-explorer-crumbs'
    }, {
      content: /*#__PURE__*/React.createElement("div", {
        className: "montserrat charcoal"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "f3 fw4"
      }, t('tour.explorer.step3.title')), /*#__PURE__*/React.createElement("p", {
        className: "tl f6"
      }, t('tour.explorer.step3.paragraph1'))),
      placement: 'right',
      target: '.joyride-explorer-node'
    }, {
      content: /*#__PURE__*/React.createElement("div", {
        className: "montserrat charcoal"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "f3 fw4"
      }, t('tour.explorer.step4.title')), /*#__PURE__*/React.createElement("p", {
        className: "tl f6"
      }, t('tour.explorer.step4.paragraph1'))),
      placement: 'left',
      target: '.joyride-explorer-cid'
    }, {
      content: /*#__PURE__*/React.createElement("div", {
        className: "montserrat charcoal"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "f3 fw4"
      }, t('tour.explorer.step5.title')), /*#__PURE__*/React.createElement("p", {
        className: "tl f6"
      }, t('tour.explorer.step5.paragraph1'))),
      locale: {
        last: 'Finish'
      },
      placement: 'left',
      target: '.joyride-explorer-graph'
    }];
  },
  styles: {
    options: {
      width: '500px',
      primaryColor: '#69c4cd',
      textColor: '#34373f',
      zIndex: 999
    }
  }
};