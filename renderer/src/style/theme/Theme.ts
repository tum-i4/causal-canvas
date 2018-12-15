export interface ITheme {
    colors: {
        primary: string;
    };
    nodes: {
        font: {
            size: string;
            weight: string;
        };
        colors: {
            default: string;
            selected: string;
        };
        exogenousNodes: {
            strokeDasharray: string;
        };
        strokeWidth: {
            default: string;
            selected: string;
        }
    }
}