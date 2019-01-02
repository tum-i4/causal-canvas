import { INode } from "../../../types/GraphTypes";
import { getSubTree } from "./getSubTree";
import { IFilter } from "../../graph/FilterList";
import uuid from "uuid";

export function cmd_hightligt(args: string[], nodes: INode[]): IFilter | undefined {

    if (args.length === 0) {
        return undefined;
    }

    const node = nodes.find(node => node.title === args[0]);
    if (node === undefined) {
        return undefined;
    }

    return {
        id: uuid.v4(),
        source: node.id,
        applyTo: [node.id, ...Array.from(getSubTree(nodes, [node.id]))]
    };
}