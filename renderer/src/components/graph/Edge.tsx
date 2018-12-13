import * as React from 'react';
import { IDrawEdge } from '../../types/GraphTypes';
import { ISelect } from './Graph';

export interface IEdgeProps extends IDrawEdge {
    selected: boolean;
    select: (event: React.MouseEvent, selected: ISelect) => void
}

export const Edge: React.SFC<IEdgeProps> = ({ source, target, select, selected, id }) => {
    return (
        <g>
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="13" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#000000" />
                </marker>
            </defs>
            <path
                stroke={selected ? 'blue' : "black"}
                onClick={(ev) => select(ev, { nodes: [], edges: [id] })}
                strokeWidth="2"
                d={`M${source.x},${source.y}L${target.x},${target.y}`}
                markerEnd={'url(#arrow)'}
            />
        </g>
    )
}