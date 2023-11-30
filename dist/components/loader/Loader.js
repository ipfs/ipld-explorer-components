import React from 'react';
import './Loader.css';
export const Loader = _ref => {
  let {
    color = 'light',
    ...props
  } = _ref;
  const className = `dib la-ball-triangle-path la-${color} la-sm`;
  return /*#__PURE__*/React.createElement("div", props, /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      width: 20,
      height: 20
    }
  }, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null)));
};