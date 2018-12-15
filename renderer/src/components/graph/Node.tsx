import * as React from 'react';
import { INode } from '../../types/GraphTypes';
import { ISelect, MoveType } from './Graph';
import styled from './../../style/theme/styled-components';

const NodeShape = styled.ellipse<React.SVGProps<SVGEllipseElement> & { selected: boolean, isExogenousVariable: boolean }>`
    stroke: ${props => props.selected ? 'blue' : 'black'};
    stroke-dasharray: ${props => props.isExogenousVariable ? props.theme.nodes.exogenousNodes.strokeDasharray : ''};
    stroke-width: ${props => props.selected ? props.theme.nodes.strokeWidth.selected : props.theme.nodes.strokeWidth.default};
`

const NodeText = styled.text<React.SVGProps<SVGTextElement>>`
    font-size: ${props => props.theme.nodes.font.size};
    font-wight: ${props => props.theme.nodes.font.weight};
`

export interface INodeProps extends INode {
    selected: boolean;
    select: (event: React.MouseEvent, selected: ISelect) => void;
    dragStart: (moveType: MoveType) => void;
    startNewEdge: (sourceID: string) => void;
    endNewEdge: (sourceID: string) => void;
}

export const Node: React.SFC<INodeProps> = ({ x, y, selected, select, id, dragStart, startNewEdge, endNewEdge, title, isExogenousVariable }) => {
    return (
        <g
            onMouseDown={
                (ev) => {
                    ev.stopPropagation();

                    if (!selected) {
                        return;
                    }
                    if (ev.ctrlKey) {
                        return dragStart(MoveType.Selection)
                    }

                    return startNewEdge(id);
                }
            }
            onMouseUp={
                (ev) => {
                    if (!ev.ctrlKey) {
                        return endNewEdge(id);
                    }
                }
            }
            onClick={(ev) => select(ev, { nodes: [id], edges: [] })}
        >
            <NodeShape
                isExogenousVariable={isExogenousVariable}
                selected={selected}
                cx={x}
                cy={y}
                rx="80"
                ry="30"
                fill="lightgrey"
            />
            <NodeText textAnchor="middle" x={x} y={y} fill='#000000'>{title}</NodeText>
        </g>
    )
}