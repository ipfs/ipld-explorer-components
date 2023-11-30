import React from 'react';
import { useTranslation } from 'react-i18next';
export function IpldExploreErrorComponent(_ref) {
  let {
    error
  } = _ref;
  const {
    t
  } = useTranslation('explore', {
    keyPrefix: 'errors'
  });
  if (error == null) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-red white pa3 lh-copy"
  }, /*#__PURE__*/React.createElement("div", null, error.toString(t)));
}