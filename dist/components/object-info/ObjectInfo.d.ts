export function shortNameForNode(type: any): any;
export function nameForNode(type: any): any;
export function colorForNode(type: any): any;
export function toExpandPathsNotation(localPath: any): any;
declare const _default: React.ComponentType<Omit<{
    type: string;
    data: import('../../types').NormalizedDagNode['data'];
    cid: string;
    links: object[];
    size: bigint;
    format: string;
    localPath: string;
    t: any;
    tReady: boolean;
    className: string;
    onLinkClick: Function;
    gatewayUrl: string;
    publicGatewayUrl: string;
}, keyof import("react-i18next").WithTranslation<N, undefined>> & import("react-i18next").WithTranslationProps>;
export default _default;
import React from 'react';