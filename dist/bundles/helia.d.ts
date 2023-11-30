import { type Helia } from '@helia/interface';
import type { KuboGatewayOptions } from '../types.d.js';
interface HeliaBundleState {
    kuboGatewayOptions: KuboGatewayOptions;
    instance: Helia | null;
    error: Error | null;
}
declare const bundle: {
    name: string;
    reducer(state: HeliaBundleState, { type, payload, error }: {
        type: string;
        payload: Partial<HeliaBundleState>;
        error?: Error | undefined;
    }): HeliaBundleState;
    selectHelia: ({ helia }: {
        helia: HeliaBundleState;
    }) => Helia<import("@libp2p/interface").Libp2p<import("@libp2p/interface").ServiceMap>> | null;
    selectHeliaReady: ({ helia }: {
        helia: HeliaBundleState;
    }) => boolean;
    selectHeliaIdentity: ({ helia }: {
        helia: HeliaBundleState;
    }) => string;
    doInitHelia: () => ({ dispatch, getState }: any) => Promise<any>;
};
export default bundle;
