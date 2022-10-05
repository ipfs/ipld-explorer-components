const Environment = require('jest-environment-jsdom')

module.exports = class CustomTestEnvironment extends Environment {
  async setup () {
    await super.setup()
    if (typeof this.global.TextEncoder === 'undefined') {
    /**
     * Fix TextDecoder and TextEncoder not being defined in Jest
     * @see https://github.com/jsdom/jsdom/issues/2524#issuecomment-736672511
     */
      const { TextEncoder, TextDecoder } = require('util')
      this.global.TextEncoder = TextEncoder
      this.global.TextDecoder = TextDecoder
    }
  }
}
