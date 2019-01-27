import { IGraph, INode } from "../types/GraphTypes";
import { graphToDrawGraph } from "../graph-layout/graphToDrawGraph";
import { d3ForceGraphLayout } from "../graph-layout/d3ForceLayout";
import { dagreLayout } from "../graph-layout/dagreLayout";
import { IGeneralSettings, LayoutTypes } from "../components/settings/GeneralSettings";


export async function extracterReportToGraph(src: string, settings: IGeneralSettings, width: number, height: number): Promise<IGraph> {

    const parts = src.split('\n\n');
    const graph = {
        title: getTitel(parts[0]),
        directed: true,
        nodes: getNodes(parts[1], parts[2])
    }
    const drawGraph = graphToDrawGraph(graph);
    let layoutedDrawGraph;

    if (drawGraph.nodes.length > 50) {
        if (settings.graphLayout.medium === LayoutTypes.Dagre) {
            layoutedDrawGraph = dagreLayout(drawGraph);
        } else {
            layoutedDrawGraph = await d3ForceGraphLayout(drawGraph, width, height);
        }
    } else if (drawGraph.nodes.length > 200) {
        if (settings.graphLayout.big === LayoutTypes.Dagre) {
            layoutedDrawGraph = dagreLayout(drawGraph);
        } else {
            layoutedDrawGraph = await d3ForceGraphLayout(drawGraph, width, height);
        }
    } else {
        if (settings.graphLayout.small === LayoutTypes.Dagre) {
            layoutedDrawGraph = dagreLayout(drawGraph);
        } else {
            layoutedDrawGraph = await d3ForceGraphLayout(drawGraph, width, height);
        }
    }

    return {
        ...graph,
        nodes: layoutedDrawGraph.nodes
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
        value: true,
        isExogenousVariable: true
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
            value: true,
            isExogenousVariable: false
        }));


    return [...exoNodes, ...endoNodes];
}