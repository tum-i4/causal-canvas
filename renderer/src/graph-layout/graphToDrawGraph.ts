import { IGraph, IDrawGraph, IDrawEdge, INode, IEdge } from "../types/GraphTypes";
import _ from 'lodash';


export function graphToDrawGraph(graph: IGraph): IDrawGraph {
    const edges = getEdgeFromNodesFormula(graph.nodes, new Map<string, INode>(graph.nodes.map((n): [string, INode] => [n.id, n])));
    return {
        nodes: graph.nodes,
        edges
    }
}

function getEdgeFromNodesFormula(_nodes: INode[], nodes: Map<string, INode>): IDrawEdge[] {

    const getNodeByID = (id: string): INode | undefined => nodes.get(id);

    const makeDrawEdgeFromEdge = (sourceID: string, targetID: string): IDrawEdge | undefined => {
        const source = getNodeByID(sourceID);
        const target = getNodeByID(targetID);
        if (source === undefined || target === undefined) {
            return undefined;
        }

        return {
            source,
            target,
            id: `${sourceID}-${targetID}`
        };
    }

    return _.flatten(_nodes.map(node => {

        const { id, formula } = node;

        const edges = formula
            .replace(/!|\(|\)/g, '')
            .split(/&|\|/)
            .filter(target => target.length > 0)
            .map((source) => makeDrawEdgeFromEdge(source, id))
            .filter(edge => edge !== undefined) as IDrawEdge[];

        return edges;
    }))
}

