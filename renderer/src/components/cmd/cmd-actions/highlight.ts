import { INode } from "../../../types/GraphTypes";
import { getSubTree } from "./getSubTree";

export function cmd_hightligt(args: string[], nodes: INode[]): string[] {

    if (args.length === 0) {
        return [];
    }

    const node = nodes.find(node => node.title === args[0]);
    if (node === undefined) {
        return [];
    }

    return [node.id, ...Array.from(getSubTree(nodes, [node.id]))];
}