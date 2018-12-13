import { IDrawGraph, IEdge } from "../types/GraphTypes";
import * as d3 from 'd3';
import _ from 'lodash';


export function d3ForceGraphLayout(graphInput: IDrawGraph): Promise<IDrawGraph> {

    return new Promise<IDrawGraph>((resolve, reject) => {
        const graph = _.cloneDeep(graphInput);

        let timeout: NodeJS.Timeout | null = null;
        const debounce = () => {
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                simulation.stop();
                resolve(graph);
            }, 100);
        }
        const edges: IEdge[] = graph.edges.map((edge): IEdge => ({
            id: edge.id,
            source: edge.source.id,
            target: edge.target.id,
        }))

        const simulation = d3.forceSimulation(graph.nodes)
            .force("link", d3.forceLink(edges).id((d: any) => d.id).distance(500))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter())
            .on('tick', () => {
                console.log('tick');
                debounce();
            })

        debounce();
    });
}