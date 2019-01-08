import React, { Component } from 'react';
import styled from '../../style/theme/styled-components';
import Graph from '../graph/Graph';


const QueryInputContainer = styled.div<{ width: number }>`
    position: fixed;
    right: 0;
    top: 0;
    width: ${props => props.width}px;
    height: 100%;
    background-color: ${props => props.theme.colors.primary}
`

interface IQueryInputState {

}

interface IQueryInputProps {
    width: number;
    graph: Graph;
}

export class QueryInput extends Component<IQueryInputProps, IQueryInputState> {


    public render() {

        const { width } = this.props;

        return <QueryInputContainer
            width={width}
        >

        </QueryInputContainer>
    }
}