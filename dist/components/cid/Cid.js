function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
export function cidStartAndEnd(value) {
  const chars = value.split('');
  if (chars.length <= 9) return value;
  const start = chars.slice(0, 4).join('');
  const end = chars.slice(chars.length - 4).join('');
  return {
    value,
    start,
    end
  };
}
export function shortCid(value) {
  const {
    start,
    end
  } = cidStartAndEnd(value);
  return `${start}…${end}`;
}
const Cid = _ref => {
  let {
    value,
    title,
    style,
    ...props
  } = _ref;
  style = Object.assign({}, {
    textDecoration: 'none'
  }, style);
  const {
    start,
    end
  } = cidStartAndEnd(value);
  return /*#__PURE__*/React.createElement("abbr", _extends({
    title: title || value,
    style: style
  }, props), /*#__PURE__*/React.createElement("span", null, start), /*#__PURE__*/React.createElement("span", {
    className: "o-20"
  }, "\u2026"), /*#__PURE__*/React.createElement("span", null, end));
};
export default Cid;