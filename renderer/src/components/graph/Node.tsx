import * as React from 'react';
import { INode } from '../../types/GraphTypes';
import { ISelect, MoveType } from './Graph';
import styled from './../../style/theme/styled-components';
import { withTheme } from 'styled-components';
import { ITheme } from '../../style/theme/Theme';

const NodeShape = styled.ellipse<React.SVGProps<SVGEllipseElement> & { selected: boolean, isExogenousVariable: boolean, markAsPartOfFormular: boolean }>`
    stroke: ${
    props => props.selected ? props.theme.node.borderColor.selected
        : props.markAsPartOfFormular ? props.theme.node.borderColor.formular
            : props.theme.node.borderColor.default
    };
    stroke-width: ${
    props => props.selected || props.markAsPartOfFormular ? props.theme.node.strokeWidth.selected
        : props.theme.node.strokeWidth.default
    };
    stroke-dasharray: ${props => props.isExogenousVariable ? props.theme.node.exogenousNodes.strokeDasharray : ''};
`

const NodeText = styled.text<React.SVGProps<SVGTextElement>>`
    font-size: ${props => props.theme.node.font.size};
    font-wight: ${props => props.theme.node.font.weight};
`

export interface INodeProps extends INode {
    markAsPartOfFormular: boolean;
    selected: boolean;
    select: (event: React.MouseEvent, selected: ISelect) => void;
    dragStart: (moveType: MoveType) => void;
    startNewEdge: (sourceID: string) => void;
    endNewEdge: (sourceID: string) => void;
    theme: ITheme;
}

const NodeRender: React.SFC<INodeProps> = ({ x, y, selected, select, id, dragStart, startNewEdge, endNewEdge, title, isExogenousVariable, markAsPartOfFormular, theme }) => {

    console.log('rerender node');
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
                markAsPartOfFormular={markAsPartOfFormular}
                cx={x}
                cy={y}
                rx={theme.node.rx}
                ry={theme.node.ry}
                fill="transparent"
            />
            <NodeText textAnchor="middle" x={x} y={y} fill='#000000'>{title}</NodeText>
        </g>
    )
}

export const Node = withTheme(NodeRender)