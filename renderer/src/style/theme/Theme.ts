export interface ITheme {
    colors: {
        background: string;
        primary: string;
    };
    node: {
        rx: number;
        ry: number;
        font: {
            size: string;
            weight: string;
        };
        borderColor: {
            default: string;
            selected: string;
            formular: string;
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