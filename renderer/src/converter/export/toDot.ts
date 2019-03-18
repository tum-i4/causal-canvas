import { IDrawGraph } from "../../types/GraphTypes";


export function drawGraphToDot(title: string, graph: IDrawGraph): string {
    return `strict digraph ${title}{\n` +
        graph.nodes.map(node => node.title).join(';\n') + `;\n` +
        graph.edges.map(edge => `${edge.source.title}->${edge.target.title}`).join(';\n') +
        `;\n}`
}