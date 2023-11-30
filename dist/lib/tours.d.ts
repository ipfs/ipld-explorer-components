export namespace projectsTour {
    function getSteps({ t }: {
        t: any;
    }): {
        content: React.JSX.Element;
        placement: string;
        target: string;
    }[];
    namespace styles {
        namespace options {
            let width: string;
            let primaryColor: string;
            let textColor: string;
            let zIndex: number;
        }
    }
}
export namespace explorerTour {
    export function getSteps_1({ t }: {
        t: any;
    }): ({
        content: React.JSX.Element;
        placement: string;
        target: string;
        locale?: undefined;
    } | {
        content: React.JSX.Element;
        locale: {
            last: string;
        };
        placement: string;
        target: string;
    })[];
    export { getSteps_1 as getSteps };
    export namespace styles_1 {
        export namespace options_1 {
            let width_1: string;
            export { width_1 as width };
            let primaryColor_1: string;
            export { primaryColor_1 as primaryColor };
            let textColor_1: string;
            export { textColor_1 as textColor };
            let zIndex_1: number;
            export { zIndex_1 as zIndex };
        }
        export { options_1 as options };
    }
    export { styles_1 as styles };
}
import React from 'react';
