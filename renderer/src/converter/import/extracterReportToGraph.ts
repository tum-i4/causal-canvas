import { IGraph, INode } from "../../types/GraphTypes";
import { IGeneralSettings } from "../../components/settings/GeneralSettings";
import * as uuid from "uuid";


export function extracterReportToGraph(src: string): IGraph {

    const parts = src.split('\n\n');
    return {
        id: uuid.v4(),
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