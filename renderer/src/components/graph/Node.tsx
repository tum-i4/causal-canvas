import * as React from 'react';
import { INode } from '../../types/GraphTypes';
import { ISelect, MoveType } from './Graph';
import styled from './../../style/theme/styled-components';
import { withTheme } from 'styled-components';
import { ITheme } from '../../style/theme/Theme';
import { onlyUpdateForKeys } from 'recompose';

const NodeShape = styled.rect<React.SVGProps<SVGRect> & { selected: boolean, isExogenousVariable: boolean, markAsPartOfFormular: boolean }>`
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
    user-select: none;
`

const StyledNodeGroupe = styled.g<{ isNotHighlight: boolean }>`
    opacity: ${props => props.isNotHighlight ? 0.25 : 1}
`

export interface INodeProps extends INode {
    isNotHighlight: boolean;
    markAsPartOfFormular: boolean;
    selected: boolean;
    select: (event: React.MouseEvent, selected: ISelect) => void;
    dragStart: (moveType: MoveType) => void;
    startNewEdge: (sourceID: string) => void;
    endNewEdge: (sourceID: string) => void;
    theme: ITheme;
}

const NodeRender: React.SFC<INodeProps> = ({ x, y, selected, select, id, dragStart, startNewEdge, endNewEdge, title, isExogenousVariable, markAsPartOfFormular, theme, isNotHighlight }) => {

    return (
        <StyledNodeGroupe
            isNotHighlight={isNotHighlight}
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
                x={x - theme.node.width / 2}
                y={y - theme.node.height / 2}
                rx={theme.node.rx}
                ry={theme.node.ry}
                height={theme.node.height}
                width={theme.node.width}
                fill={theme.node.backgroundColor.default}
            />
            <NodeText
                fontWeight={theme.node.font.weight}
                fontSize={theme.node.font.size}
                textAnchor="middle"
                x={x}
                y={y + 7}
                fill={theme.node.font.color}
            >{title}</NodeText>
        </StyledNodeGroupe>
    )
}

export const Node = onlyUpdateForKeys([
    'x', 'y', 'selected', 'title', 'markAsPartOfFormular', 'isNotHighlight', 'isExogenousVariable'
])(withTheme(NodeRender))