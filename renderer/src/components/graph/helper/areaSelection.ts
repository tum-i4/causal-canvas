import { ISelect } from "../Graph";
import { INode, IDrawEdge, IPoint } from "../../../types/GraphTypes";

export function getSelectdFromArea(nodes: INode[], area: { source: IPoint, target: IPoint }, viewPos: IPoint, sWidth: number, sHeight: number): ISelect {

    let x = area.source.x - viewPos.x - sWidth / 2;
    let y = area.source.y - viewPos.y - sHeight / 2;

    let width = area.target.x - viewPos.x - x - sWidth / 2;
    let height = area.target.y - viewPos.y - y - sHeight / 2;

    if (width < 0) {
        x += width;
        width = Math.abs(width);
    }
    if (height < 0) {
        y += height;
        height = Math.abs(height);
    }

    const selectedNodes = nodes.filter(node => nodeIntersectsArea(node, x, y, width, height)).map(node => node.id);

    return {
        nodes: selectedNodes,
        edges: []
    };
}

function nodeIntersectsArea(node: INode, x: number, y: number, width: number, height: number): boolean {

    return node.x >= x && node.x <= x + width &&
        node.y >= y && node.y <= y + height;
}