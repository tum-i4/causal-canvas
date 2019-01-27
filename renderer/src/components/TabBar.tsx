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

const CauseSearchInput = styled.input`
    width: 150px;
    height: 31px;
    text-align: left;
    padding: 3px;
    border: solid 1px ${props => props.theme.colors.primary};
    outline: none;
    &:focus{
        outline: none;
    }
`

export interface ITabBarProps {
    graphs: IGraphData[];
    selected: number;
    onChange: (idx: number) => void;
    newGraph: () => void;
    closeTab: (idx: number) => void;
    onGraphChanged: (id: string, title: string) => void;
}

interface ITabBarState {
    selected: number;
    value: string;
}

export class TabBar extends React.Component<ITabBarProps, ITabBarState>{

    constructor(props: ITabBarProps) {
        super(props);

        this.state = {
            selected: -1,
            value: ''
        }
    }

    selectItemToChange = (idx: number, value: string) => {
        this.setState({
            ...this.state,
            selected: idx,
            value
        })
    }

    onTitleInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            value: event.target.value
        })
    }

    updateParent = () => {
        this.props.onGraphChanged(this.props.graphs[this.state.selected].id, this.state.value);
        this.setState({
            ...this.state,
            selected: -1,
            value: ''
        })
    }

    onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            this.updateParent();
        }
    }

    public render() {
        const { onChange, selected, graphs, newGraph, closeTab } = this.props;
        const { value, selected: selectedIdx } = this.state;
        return <TabBarContainer>
            {
                graphs.map(
                    (g, idx) =>
                        idx === selectedIdx
                            ? <CauseSearchInput
                                value={value}
                                onChange={this.onTitleInputChanged}
                                onBlur={this.updateParent}
                                onKeyUp={this.onKeyUp}
                            />
                            : <TabBarItem
                                key={`${g.graph.title}-${idx}`}
                                onClick={() => onChange(idx)}
                                selected={selected === idx}
                                onDoubleClick={() => this.selectItemToChange(idx, g.graph.title)}
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
}