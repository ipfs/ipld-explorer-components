function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import React from 'react';
import ErrorIcon from '../../icons/GlyphSmallCancel';
class ErrorBoundary extends React.Component {
  constructor() {
    super(...arguments);
    _defineProperty(this, "state", {
      hasError: false
    });
  }
  componentDidCatch(error, info) {
    this.setState({
      hasError: true
    });
    console.error(error);
  }
  render() {
    const {
      hasError
    } = this.state;
    const {
      children,
      fallback: Fallback
    } = this.props;
    return hasError ? /*#__PURE__*/React.createElement(Fallback, null) : children;
  }
}
_defineProperty(ErrorBoundary, "defaultProps", {
  fallback: ErrorIcon
});
export default ErrorBoundary;