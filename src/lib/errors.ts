import { type TFunction } from 'i18next'

export default class IpldExploreError extends Error {
  constructor (private readonly options: Record<string, string | number>) {
    super()
    this.name = this.constructor.name
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
  toString (t: TFunction<'translation', undefined, 'translation'>): string {
    return t(this.name, this.options)
  }
}

export class BlockFetchTimeoutError extends IpldExploreError {}
