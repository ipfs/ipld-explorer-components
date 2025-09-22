import { type TFunction } from 'i18next'

export default class IpldExploreError extends Error {
  // translation key to prevent minification issues
  readonly translationKey: string

  constructor (private readonly options: Record<string, string | number>) {
    super()
    this.translationKey ??= this.constructor.name
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
  toString (t: TFunction<'translation', 'translation'>): string {
    return t(this.translationKey, this.options)
  }
}

export class BlockFetchTimeoutError extends IpldExploreError {
  readonly translationKey = 'BlockFetchTimeoutError'
}

export class BlockFetchError extends IpldExploreError {
  readonly translationKey = 'BlockFetchError'
}

export class CidSyntaxError extends IpldExploreError {
  readonly translationKey = 'CidSyntaxError'
}
