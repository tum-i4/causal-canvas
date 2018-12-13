
export interface IGraph {
    title: string;
    nodes: INode[];
    directed: boolean;
}

export interface INode {
    x: number;
    y: number;
    title: string;
    value: boolean;
    id: string;
    formula: string;
}

export interface IDrawGraph {
    nodes: INode[];
    edges: IDrawEdge[];
}

export interface IEdge {
    source: string;
    target: string;
    id: string;
}

export interface IDrawEdge {
    source: INode;
    target: INode;
    id: string;
}

export interface IPoint {
    x: number;
    y: number;
}