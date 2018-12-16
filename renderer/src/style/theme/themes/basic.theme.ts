import { ITheme } from "../Theme";

export const BasicTheme: ITheme = {
    colors: {
        background: '#ffffff',
        primary: '#3c3c3c',
    },
    node: {
        rx: 90,
        ry: 25,
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
            selected: '4'
        }
    },
    edge: {
        lineNodeSpace: 10,
        width: '3'
    }
}