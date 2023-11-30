import React from 'react';
import ErrorBoundary from '../error/ErrorBoundary';
export const Box = _ref => {
  let {
    className = 'pa4',
    style,
    children,
    ...props
  } = _ref;
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      background: '#fbfbfb',
      ...style
    }
  }, /*#__PURE__*/React.createElement(ErrorBoundary, null, children));
};
export default Box;