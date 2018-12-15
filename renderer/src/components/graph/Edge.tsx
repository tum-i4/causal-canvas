import * as React from 'react';
import { IDrawEdge, INode, IPoint } from '../../types/GraphTypes';
import { ISelect } from './Graph';
const kld = require('kld-intersections');

export interface IEdgeProps extends IDrawEdge {
    selected: boolean;
    select: (event: React.MouseEvent, selected: ISelect) => void
}

export const Edge: React.SFC<IEdgeProps> = ({ source, target, select, selected, id }) => {
    const [sourcePoint, targetPoint] = intersectionPoint(source, target);
    return (
        <g>
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#000000" />
                </marker>
            </defs>
            <path
                stroke={selected ? 'blue' : "black"}
                onClick={(ev) => select(ev, { nodes: [], edges: [id] })}
                strokeWidth="2"
                d={`M${sourcePoint.x},${sourcePoint.y}L${targetPoint.x},${targetPoint.y}`}
                markerEnd={'url(#arrow)'}
            />
            {/* <circle
                r={5}
                cx={sourcePoint.x}
                cy={sourcePoint.y}
                fill="red"
            />
            <circle
                r={5}
                cx={targetPoint.x}
                cy={targetPoint.y}
                fill="red"
            /> */}
        </g>
    )
}



function intersectionPoint(source: INode, target: INode): IPoint[] {
    const Point2D = kld.Point2D;
    const Intersection = kld.Intersection

    const rx = 85;
    const ry = 35;

    const line = {
        p1: new Point2D(source.x, source.y),
        p2: new Point2D(target.x, target.y)
    };

    // define rotated ellipse
    const ellipseSource = {
        center: new Point2D(source.x, source.y),
        radiusX: rx,
        radiusY: ry,
        angle: 0
    };

    const ellipseTarget = {
        center: new Point2D(target.x, target.y),
        radiusX: rx,
        radiusY: ry,
        angle: 0
    };

    const result1 = Intersection.intersectEllipseLine(
        ellipseSource.center, ellipseSource.radiusX, ellipseSource.radiusY,
        line.p1, line.p2
    );

    const result2 = Intersection.intersectEllipseLine(
        ellipseTarget.center, ellipseTarget.radiusX, ellipseTarget.radiusY,
        line.p1, line.p2
    );

    return [result1.points[0] || source, result2.points[0] || target];
}