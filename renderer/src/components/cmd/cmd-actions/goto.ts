import { INode, IPoint } from "../../../types/GraphTypes";

export function cmd_goto(args: string[], nodes: INode[], zoomTransform: any): IPoint {

    if (args.length === 0) {
        return zoomTransform;
    }

    const node = nodes.find(node => node.title === args[0]);
    console.log({ args, node });
    if (node === undefined) {
        return zoomTransform;
    }

    zoomTransform.x = -node.x;
    zoomTransform.y = -node.x;

    return zoomTransform;
}