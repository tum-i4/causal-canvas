import { IGraph, INode } from "../types/GraphTypes";
import { graphToDrawGraph } from "../graph-layout/graphToDrawGraph";
import { d3ForceGraphLayout } from "../graph-layout/d3ForceLayout";
import { dagreLayout } from "../graph-layout/dagreLayout";
import { IGeneralSettings, LayoutTypes } from "../components/settings/GeneralSettings";


export async function layoutGraph(src: IGraph, settings: IGeneralSettings, width: number, height: number): Promise<IGraph> {

    const drawGraph = graphToDrawGraph(src);
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

    // let sum = 0;
    // for (let i = 0; i < 10; i++) {
    //     console.log("start layout")
    //     let start = Date.now();
    //     console.time('layout')
    //     // layoutedDrawGraph = dagreLayout(drawGraph);
    //     layoutedDrawGraph = await d3ForceGraphLayout(drawGraph, width, height);
    //     console.timeEnd('layout')
    //     sum += Date.now() - start;
    // }

    // const avg = sum / 10;
    // console.log(src.title, avg + "ms", avg / 1000 + "s");

    return {
        ...src,
        nodes: layoutedDrawGraph.nodes
    }
}