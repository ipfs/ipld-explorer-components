import type IpldExploreError from '../../lib/errors';
export interface IpldExploreErrorComponentProps {
    error?: IpldExploreError;
}
export declare function IpldExploreErrorComponent({ error }: IpldExploreErrorComponentProps): JSX.Element | null;
