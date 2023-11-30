export default class IpldGraphCytoscape extends React.Component<any, any, any> {
    static getDerivedStateFromProps(props: any, state: any): {
        truncatedLinks: any;
    };
    constructor(props: any);
    graphRef: React.RefObject<any>;
    renderTree({ path, links, container }: {
        path: any;
        links: any;
        container: any;
    }): any;
    ipfsLinksToCy(links: any): any[];
    cy: any;
    state: {};
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): React.JSX.Element;
    makeNode({ target, path }: {
        target: any;
        path: any;
    }, index: any): {
        group: string;
        data: {
            id: any;
            path: any;
            bg: any;
            index: any;
        };
    };
    makeLink({ source, target, path }: {
        source: any;
        target: any;
        path: any;
    }, index: any): {
        group: string;
        data: {
            source: any;
            target: any;
            index: any;
        };
    };
    runLayout(cy: any): void;
}
import React from 'react';
