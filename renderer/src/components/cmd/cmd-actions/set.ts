import { INode } from "../../../types/GraphTypes";


export function cmd_set(args: string[], nodes: INode[]): INode[] {

    if (args.length < 2) {
        return nodes;
    }

    try {
        console.log(RegExp(args[0]));
    } catch (err) {

    }

    const value: boolean = args[1] === 'true';
    const setNode = (node: INode, testExp: string): INode => {
        try {
            if (testExp === 'all' || RegExp(testExp).test(node.title)) {
                node.value = value;
                return node;
            }
        } catch (err) {

        }

        return node;
    }

    return nodes.map(node => !node.isExogenousVariable ? node : setNode(node, args[0]))
}