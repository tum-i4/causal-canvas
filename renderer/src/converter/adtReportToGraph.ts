import { IGraph, INode } from "../components/graph/GraphTypes";


export function adtReportToGraph(src: string): IGraph {

    const parts = src.split('\n\n');

    return {
        title: getTitel(parts[0]),
        directed: true,
        nodes: getNodes(parts[1], parts[2])
    }
}


function getTitel(titlePart: string): string {
    return titlePart.split("'")[1];
}

function getNodes(exoPart: string, endoPart: string): INode[] {

    const [exoTitle, ...exoValues] = exoPart.split('\n');
    const exoNodes = exoValues.map((name): INode => ({
        title: name,
        x: 0,
        y: 0,
        formula: '',
        id: name,
        value: true
    }))

    const [endoTitle, ...endoValues] = endoPart.split('\n');
    const endoNodes = endoValues
        .map(endoString => endoString.split(' = '))
        .map(([name, formula]): INode => ({
            title: name,
            x: 0,
            y: 0,
            formula: formula.replace(/\sand\s/g, '&').replace(/\sor\s/g, '|'),
            id: name,
            value: true
        }));


    return [...exoNodes, ...endoNodes];
}