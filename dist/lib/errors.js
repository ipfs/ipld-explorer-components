export default class IpldExploreError extends Error {
  constructor(options) {
    super();
    this.options = options;
    this.name = this.constructor.name;
  }

  /**
   * See IpldExploreError for usage.
   * You must pass a t function that is registered with namespace 'explore' and keyPrefix 'errors'.
   *
   * @param t - the i18next-react t function
   * @returns the translated string
   * @example
   * const {t} = useTranslation('explore', { keyPrefix: 'errors' })
   * t('NameOfErrorClassThatExtendsIpldExploreError')
   */
  toString(t) {
    return t(this.name, this.options);
  }
}
export class BlockFetchTimeoutError extends IpldExploreError {}