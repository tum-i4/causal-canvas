import { INode, IPoint } from "../../../types/GraphTypes";

export function cmd_goto(args: string[], nodes: INode[], viewPos: IPoint): IPoint {

    if (args.length === 0) {
        return viewPos;
    }

    const node = nodes.find(node => node.title === args[0]);

    if (node === undefined) {
        return viewPos;
    }

    const newPos = { x: -node.x, y: -node.y }

    return newPos;
}