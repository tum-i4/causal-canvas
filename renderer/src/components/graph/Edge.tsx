import * as React from 'react';
import { IDrawEdge, INode, IPoint } from '../../types/GraphTypes';
import { ISelect } from './Graph';
const kld = require('kld-intersections');
import { withTheme } from 'styled-components';
import { ITheme } from '../../style/theme/Theme';
import { onlyUpdateForKeys } from 'recompose';
import styled from './../../style/theme/styled-components';


export interface IEdgeProps extends IDrawEdge {
    selected: boolean;
    select: (event: React.MouseEvent, selected: ISelect) => void;
    theme: ITheme;
    isNewEge?: boolean;
    isNotHighlight: boolean;
}

const StyledEdgeGroupe = styled.g<{ isNotHighlight: boolean }>`
    opacity: ${props => props.isNotHighlight ? 0.25 : 1}
`

const EdgeRender: React.SFC<IEdgeProps> = ({ source, target, select, selected, id, theme, isNewEge, isNotHighlight }) => {
    const [sourcePoint, targetPoint] = isNewEge ? [source, target] : intersectionPoint(source, target, theme);
    return (
        <StyledEdgeGroupe
            isNotHighlight={isNotHighlight}
        >
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#000000" />
                </marker>
            </defs>
            <path
                stroke={selected ? 'blue' : "black"}
                onClick={(ev) => select(ev, { nodes: [], edges: [id] })}
                strokeWidth={theme.edge.width}
                d={`M${sourcePoint.x},${sourcePoint.y}L${targetPoint.x},${targetPoint.y}`}
                markerEnd={'url(#arrow)'}
            />
        </StyledEdgeGroupe>
    )
}

function intersectionPoint(source: INode, target: INode, theme: ITheme): IPoint[] {
    const Point2D = kld.Point2D;
    const Intersection = kld.Intersection

    const rx = theme.node.rx + theme.edge.lineNodeSpace;
    const ry = theme.node.ry + theme.edge.lineNodeSpace;

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

export const Edge = onlyUpdateForKeys([
    'source', 'target', 'isNotHighlight'
])(withTheme(EdgeRender));
