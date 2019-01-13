import React, { Component } from 'react';
import { QueryInput } from './QueryInput';
import { QueryResult } from './QueryResult';
import Graph from '../graph/Graph';

import { IpcRenderer } from 'electron';
import { forumlaToJavaFormula } from '../util';
const electron = (window as any).require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer: IpcRenderer = electron.ipcRenderer;

export interface INewModelData {
    name: string;
    exos: string[];
    endos: {
        name: string;
        formula: string;
    }[]
}

export interface IQueryData {
    context: {
        name: string;
        value: boolean;
    }[];
    cause: {
        name: string;
        value: boolean;
    }[];
    phi: string;
    solvingStrategy: string;
}

interface IQueryContainerState {
    result: string;
}

interface IQueryContainerProps {
    width: number;
    height: number;
    graph: Graph;
}

export class QueryContainer extends Component<IQueryContainerProps, IQueryContainerState> {


    constructor(props: IQueryContainerProps) {
        super(props);

        this.state = {
            result: ''
        }
    }

    componentDidMount() {
        ipcRenderer.on('query-result', this.onQueryResult)

        const graph = this.props.graph.getCurrentGraph();

        const endos = graph.nodes.filter(n => !n.isExogenousVariable).map(n => ({
            formula: forumlaToJavaFormula(n.formula),
            name: n.title
        }))

        const exos = graph.nodes.filter(n => n.isExogenousVariable).map(n => n.title);
        this.setModel({
            endos,
            exos,
            name: graph.title
        })
    }

    componentWillUnmount() {
    }

    private onQueryResult = (event, result) => {
        console.log(result);
        this.setState({
            ...this.state,
            result,
        })
    }

    private sendQuery = (query: IQueryData) => {
        ipcRenderer.send('query', query)
    }

    private setModel = (model: INewModelData) => {
        ipcRenderer.send('setModel', model);
    }

    public render() {

        const { width, height, graph } = this.props;

        return <React.Fragment>
            <QueryInput
                query={this.sendQuery}
                width={width}
                graph={graph}
            />
            <QueryResult
                result={this.state.result}
                height={height}
                width={width}
            />
        </React.Fragment>
    }
}