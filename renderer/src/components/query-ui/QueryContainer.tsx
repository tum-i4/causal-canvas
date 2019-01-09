import React, { Component } from 'react';
import { QueryInput } from './QueryInput';
import { QueryResult } from './QueryResult';
import Graph from '../graph/Graph';

interface IQueryContainerState {

}

interface IQueryContainerProps {
    width: number;
    height: number;
    graph: Graph;
}

export class QueryContainer extends Component<IQueryContainerProps, IQueryContainerState> {


    public render() {

        const { width, height, graph } = this.props;

        return <React.Fragment>
            <QueryInput
                width={width}
                graph={graph}
            />
            <QueryResult
                height={height}
                width={width}
            />
        </React.Fragment>
    }
}