import { INode } from "../../../types/GraphTypes";

export function getSubTree(nodes: INode[], startNodes: string[]) {

    const getNodeByID = (id: string) => nodes.find(node => node.id === id);
    let returnSet = new Set<string>();
    let nextNodes = nodes.filter(node => startNodes.includes(node.id));

    while (nextNodes.length !== 0) {
        let newSet = getNodesFromFormula(nextNodes);
        let diff = difference(newSet, returnSet)
        nextNodes = diff.map(id => getNodeByID(id)!).filter(node => node !== undefined)

        newSet.forEach(id => returnSet.add(id))
    };

    return returnSet;
}

const getNodesFromFormula = (nodes: INode[]): Set<string> => {
    let set = new Set<string>();
    nodes.forEach(node => {
        node.formula.replace(/!|\(|\)/g, '').replace(/&|\|/g, ' ').split(' ').forEach(id => set.add(id))
    });
    return set;
}

//let a = new Set([1,2,3]);
//let b = new Set([4,3,2]);
// => {1}
const difference = (a: Set<string>, b: Set<string>) => Array.from(a).filter(x => !b.has(x));