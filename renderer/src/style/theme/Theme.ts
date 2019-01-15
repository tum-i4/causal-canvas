export interface ITheme {
    colors: {
        background: string;
        highlightBackground: string;
        primary: string;
        secondary: string;
    };
    node: {
        rx: number;
        ry: number;
        height: number;
        width: number;
        font: {
            size: string;
            weight: string;
            color: string;
        };
        backgroundColor: {
            default: string;
        }
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
        color: {
            default: string;
            selected: string;
        };
    }
}