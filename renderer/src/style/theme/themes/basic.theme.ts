import { ITheme } from "../Theme";

export const BasicTheme: ITheme = {
    colors: {
        background: '#ffffff',
        primary: '#7c7c7c',
        secondary: '#48dbfb'
    },
    node: {
        rx: 95,
        ry: 35,
        font: {
            size: '25',
            weight: '700',
            color: '#000000'
        },
        backgroundColor: {
            default: '#ffffff'
        },
        borderColor: {
            default: 'black',
            selected: '#2ed573',
            formular: '#ff793f'
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