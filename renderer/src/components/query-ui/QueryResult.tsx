import React, { Component } from 'react';
import styled from '../../style/theme/styled-components';


const QueryResultContainer = styled.div<{ height: number, width: number }>`
    position: fixed;
    left: 0;
    bottom: 0;
    height: ${props => props.height}px;
    width: calc(100% - ${props => props.width}px);
    background-color: ${props => props.theme.colors.background};
    border-top: 1px solid ${props => props.theme.colors.primary};

`

interface IQueryResultState {

}

interface IQueryResultProps {
    height: number;
    width: number;
    result: string;
}

export class QueryResult extends Component<IQueryResultProps, IQueryResultState> {

    public render() {

        const { height, width } = this.props;

        return <QueryResultContainer
            height={height}
            width={width}
        >
            {JSON.stringify(this.props.result, null, 2)}
        </QueryResultContainer>
    }
}