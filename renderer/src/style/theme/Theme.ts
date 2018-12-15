export interface ITheme {
    colors: {
        primary: string;
    };
    node: {
        rx: number;
        ry: number;
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
    };
    edge: {
        width: string;
        lineNodeSpace: number;
    }
}