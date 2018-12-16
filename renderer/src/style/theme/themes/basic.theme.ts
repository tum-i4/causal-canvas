import { ITheme } from "../Theme";

export const BasicTheme: ITheme = {
    colors: {
        background: '#ffffff',
        primary: '#7c7c7c',
        secondary: '#48dbfb'
    },
    node: {
        rx: 90,
        ry: 30,
        font: {
            size: '18',
            weight: '500'
        },
        borderColor: {
            default: 'black',
            selected: 'blue',
            formular: 'red'
        },
        exogenousNodes: {
            strokeDasharray: "8 8"
        },
        strokeWidth: {
            default: '2',
            selected: '3'
        }
    },
    edge: {
        lineNodeSpace: 10,
        width: '3'
    }
}