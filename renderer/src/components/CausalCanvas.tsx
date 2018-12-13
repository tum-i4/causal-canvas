import React, { Component } from 'react';
import Graph from './graph/Graph';
import { IGraph, INode, IEdge } from '../types/GraphTypes';
import _ from 'lodash';
import { IpcRenderer } from 'electron';
import { adtReportToGraph } from '../converter/adtReportToGraph';
const electron = (window as any).require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer: IpcRenderer = electron.ipcRenderer;

interface ICausalCanvasState {
    width: number;
    height: number;
    graph: IGraph;
}

class CausalCanvas extends Component<any, ICausalCanvasState> {

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            graph: getTestData()
        }

        this.updateWindowDimensions = _.debounce(this.updateWindowDimensions, 200);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        ipcRenderer.on('import', (event, data) => {
            //console.log(data);
            const graph = adtReportToGraph(data);
            console.log(graph);
            this.setState({ graph });
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {

        const { width, height, graph } = this.state;

        return <Graph
            width={width}
            height={height}
            data={graph}
        />
    }
}

export default CausalCanvas;


function getTestData(): IGraph {
    const nodeA: INode = {
        x: 400,
        y: 300,
        title: 'a',
        value: true,
        id: 'a',
        formula: 'b&c'
    }

    const nodeB: INode = {
        x: 300,
        y: 400,
        title: 'b',
        value: true,
        id: 'b',
        formula: ''
    }

    const nodeC: INode = {
        x: 500,
        y: 400,
        title: 'c',
        value: true,
        id: 'c',
        formula: ''
    }

    return {
        directed: true,
        title: 'test',
        nodes: [nodeA, nodeB, nodeC],
    }
}