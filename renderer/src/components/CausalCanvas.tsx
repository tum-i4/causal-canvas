import React, { Component, createRef } from 'react';
import Graph from './graph/Graph';
import { IGraph, INode, IEdge } from '../types/GraphTypes';
import _ from 'lodash';
import { IpcRenderer } from 'electron';
import { extracterReportToGraph } from '../converter/extracterReportToGraph';
import { Cmd } from './cmd/Cmd';
const electron = (window as any).require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer: IpcRenderer = electron.ipcRenderer;

interface ICausalCanvasState {
    width: number;
    height: number;
    graph: IGraph;
}

export enum GraphImportType {
    Extracter,
    CausalModel
}

export interface IGraphImportData {
    type: GraphImportType;
    src: string;
}

class CausalCanvas extends Component<any, ICausalCanvasState> {

    private graphRef = createRef<Graph>();

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

        ipcRenderer.on('import', async (event, data) => this.handelGraphImport(JSON.parse(data)))

        ipcRenderer.on('save', async (event, data) => {
            if (this.graphRef.current !== null) {
                const graph = this.graphRef.current.getCurrentGraph();
                ipcRenderer.send('saveToFile', JSON.stringify({
                    type: 'save',
                    data: JSON.stringify(graph, null, 2)
                }));
            }
        })

        ipcRenderer.on('saveas', async (event, data) => {
            if (this.graphRef.current !== null) {
                const graph = this.graphRef.current.getCurrentGraph();
                ipcRenderer.send('saveToFile', JSON.stringify({
                    type: 'saveas',
                    data: JSON.stringify(graph, null, 2)
                }));
            }
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handelGraphImport = async (data: IGraphImportData) => {

        let graph: IGraph | null = null;

        switch (data.type) {
            case GraphImportType.Extracter: graph = await extracterReportToGraph(data.src); break;
            case GraphImportType.CausalModel: graph = JSON.parse(data.src); break;
        }

        if (graph !== null) {
            this.setState({ graph });
        }
    }

    render() {

        const { width, height, graph } = this.state;

        if (width === 0) {
            return null;
        }

        return <React.Fragment>
            <Graph
                ref={this.graphRef}
                width={width}
                height={height}
                data={graph}
            />
            <Cmd />
        </React.Fragment>

    }
}

export default CausalCanvas;


function getTestData(): IGraph {
    const nodeA: INode = {
        x: 0,
        y: 0,
        title: 'a',
        value: true,
        id: 'a',
        formula: 'b&c',
        isExogenousVariable: false
    }

    const nodeB: INode = {
        x: 100,
        y: 100,
        title: 'b',
        value: true,
        id: 'b',
        formula: '',
        isExogenousVariable: true
    }

    const nodeC: INode = {
        x: -100,
        y: 100,
        title: 'c',
        value: true,
        id: 'c',
        formula: '',
        isExogenousVariable: true
    }

    return {
        directed: true,
        title: 'test',
        nodes: [nodeA, nodeB, nodeC],
    }
}