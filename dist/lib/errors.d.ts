import { type TFunction } from 'i18next';
export default class IpldExploreError extends Error {
    private readonly options;
    constructor(options: Record<string, string | number>);
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
    toString(t: TFunction<'translation', undefined, 'translation'>): string;
}
export declare class BlockFetchTimeoutError extends IpldExploreError {
}
