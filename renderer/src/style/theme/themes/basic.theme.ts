import { ITheme } from "../Theme";

export const BasicTheme: ITheme = {
    colors: {
        background: '#ffffff',
        highlightBackground: '#EBEBEB',
        primary: '#7c7c7c',
        secondary: '#48dbfb',
        error: '#ff4757',
        success: '#2ecc71'
    },
    node: {
        rx: 5,
        ry: 5,
        height: 46,
        width: 220,
        font: {
            size: '25',
            weight: '500',
            color: '#000000'
        },
        backgroundColor: {
            default: '#ffffff'
        },
        borderColor: {
            default: '#7c7c7c',
            selected: '#2ed573',
            formular: '#ff793f'
        },
        exogenousNodes: {
            strokeDasharray: "8 8"
        },
        strokeWidth: {
            default: '1',
            selected: '2'
        }
    },
    edge: {
        lineNodeSpace: 10,
        width: '2',
        color: {
            default: 'black',
            selected: '#2ed573'
        }
    }
}