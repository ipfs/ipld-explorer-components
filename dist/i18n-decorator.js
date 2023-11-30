import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
export default function i18nDecorator(fn) {
  return /*#__PURE__*/React.createElement(I18nextProvider, {
    i18n: i18n
  }, fn());
}