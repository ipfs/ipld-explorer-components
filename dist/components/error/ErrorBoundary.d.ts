export default ErrorBoundary;
declare class ErrorBoundary extends React.Component<any, any, any> {
    static defaultProps: {
        fallback: (props: any) => React.JSX.Element;
    };
    constructor(props: any);
    constructor(props: any, context: any);
    state: {
        hasError: boolean;
    };
    componentDidCatch(error: any, info: any): void;
    render(): any;
}
import React from 'react';
