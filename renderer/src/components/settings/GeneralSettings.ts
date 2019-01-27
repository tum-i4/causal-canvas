
export enum LayoutTypes {
    Dagre = 'dagre',
    D3Force = 'd3-force'
}

export interface IGeneralSettings {
    graphLayout: {
        small: LayoutTypes;
        medium: LayoutTypes;
        big: LayoutTypes;
    };
}

export const GeneralSettingsDefault: IGeneralSettings = {
    graphLayout: {
        small: LayoutTypes.Dagre,
        medium: LayoutTypes.D3Force,
        big: LayoutTypes.D3Force,
    }
}