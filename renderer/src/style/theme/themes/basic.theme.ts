import { ITheme } from "../Theme";

export const BasicTheme: ITheme = {
    colors: {
        primary: 'red',
    },
    nodes: {
        font: {
            size: '18',
            weight: '500'
        },
        colors: {
            default: 'black',
            selected: 'blue'
        },
        exogenousNodes: {
            strokeDasharray: "6 3"
        },
        strokeWidth: {
            default: '2',
            selected: '3'
        }
    }
}