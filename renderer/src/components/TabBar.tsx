import * as React from 'react';
import styled from '../style/theme/styled-components';
import { IGraphData } from './CausalCanvas';

const TabBarContainer = styled.div`
    position: absolute;
    background-color: ${props => props.theme.colors.background};
    display: flex;
    height: 32px;
    width: 100%;
`

const TabBarItem = styled.div<{ selected: boolean }>`
    border-bottom: ${props => props.selected ? `1px solid ${props.theme.colors.background}` : `1px solid ${props.theme.colors.primary}`};
    border-right: 1px solid ${props => props.theme.colors.primary};
    padding: 5px 20px;
    cursor: pointer;
    &:hover{
        padding: 5px 10px 5px 20px;
    }
`

const CloseTabBtn = styled.div`
    margin-left: 5px;
    display: none;
    ${TabBarItem}:hover & {
        display: inline-block;
    }
`

const TabBarBorder = styled.div`
    flex: 1;
    border-bottom: 1px solid ${props => props.theme.colors.primary};
`

export interface ITabBarProps {
    graphs: IGraphData[];
    selected: number;
    onChange: (idx: number) => void;
    newGraph: () => void;
    closeTab: (idx: number) => void;
}

export const TabBar: React.SFC<ITabBarProps> = ({ onChange, selected, graphs, newGraph, closeTab }) => {
    return <TabBarContainer>
        {
            graphs.map(
                (g, idx) =>
                    <TabBarItem
                        key={`${g.graph.title}-${idx}`}
                        onClick={() => onChange(idx)}
                        selected={selected === idx}
                    >
                        {g.graph.title + (g.changed ? '*' : '')}
                        <CloseTabBtn
                            onClick={() => closeTab(idx)}
                        >×</CloseTabBtn>
                    </TabBarItem>
            )
        }
        <TabBarBorder
            onDoubleClick={newGraph}
        />
    </TabBarContainer>
}