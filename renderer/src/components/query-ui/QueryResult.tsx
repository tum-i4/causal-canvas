import React, { Component } from 'react';
import styled from '../../style/theme/styled-components';


const QueryResultContainer = styled.div<{ height: number }>`
    position: fixed;
    left: 0;
    bottom: 0;
    height: ${props => props.height}px;
    width: 100%;
    background-color: ${props => props.theme.colors.primary}
`

interface IQueryResultState {

}

interface IQueryResultProps {
    height: number;
}

export class QueryResult extends Component<IQueryResultProps, IQueryResultState> {

    public render() {

        const { height } = this.props;

        return <QueryResultContainer
            height={height}
        >

        </QueryResultContainer>
    }
}