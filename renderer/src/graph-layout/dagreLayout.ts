import { IDrawGraph, INode } from "../types/GraphTypes";
import * as dagre from 'dagre';

export function dagreLayout(graphInput: IDrawGraph): IDrawGraph {

    var g = new dagre.graphlib.Graph();

    g.setGraph({});
    g.setDefaultEdgeLabel(function () { return {}; });

    for (const node of graphInput.nodes) {
        g.setNode(node.id, { label: node.title, width: 220, height: 46 })
    }

    for (const edge of graphInput.edges) {
        g.setEdge(edge.source.id, edge.target.id)
    }

    dagre.layout(g, { marginx: 100, marginy: 100 });

    const getNodeByID = (id: string): INode => graphInput.nodes.find(node => node.id === id) as any;

    return {
        ...graphInput,
        nodes: g.nodes().map(n => {
            const node = g.node(n);
            return {
                ...getNodeByID(n),
                x: node.x,
                y: node.y
            }
        })
    };
}