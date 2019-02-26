import { IGraph } from "../types/GraphTypes";

export function dotToGraph(src: string): IGraph {

    const data = src.split(/{|}/g)[1].replace(/\n|\s/g, '').split(';').filter(s => s !== '');
    const nodes_src = data.filter(d => !d.includes('->'))
    const edges_src = data.filter(d => d.includes('->'))


    let nodes = nodes_src.map(name => ({
        title: name,
        x: 0,
        y: 0,
        formula: '',
        id: name,
        value: true,
        isExogenousVariable: false
    }));

    edges_src.forEach(edge => {
        const [src, target] = edge.split('->');
        const src_node = nodes.find(node => node.id === src)!;
        src_node.formula = [...src_node.formula.split(/\|/g), target].filter(id => id !== '').join('|')
    })

    nodes = nodes.map(node => node.formula === '' ? { ...node, isExogenousVariable: true } : node)

    return {
        directed: true,
        title: src.split('{')[0].split(' ')[2],
        nodes,
    };
}