import { type TFunction } from 'i18next'

export default class IpldExploreError extends Error {
  constructor (protected readonly options: Record<string, string | number>) {
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
  toString (t: TFunction<'translation', 'translation'>): string {
    return t(this.name, this.options)
  }

  get cid (): string | undefined {
    return this.options.cid as string | undefined
  }
}

export class BlockFetchTimeoutError extends IpldExploreError {}
