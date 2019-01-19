import React, { Component, createRef } from 'react';
import { IGraph, INode } from '../types/GraphTypes';
import _ from 'lodash';
import { IpcRenderer } from 'electron';
import { extracterReportToGraph } from '../converter/extracterReportToGraph';
import CausalCanvas from './CausalCanvas';
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

class App extends Component<any, ICausalCanvasState> {

    private canvasRef = createRef<CausalCanvas>();

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            graph: susiExample()
        }

        this.updateWindowDimensions = _.debounce(this.updateWindowDimensions, 200);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        ipcRenderer.on('import', async (event, data) => this.handelGraphImport(JSON.parse(data)))

        ipcRenderer.on('save', async (event, data) => {
            if (this.canvasRef.current !== null) {
                const graph = this.canvasRef.current.getCurrentGraph();
                ipcRenderer.send('saveToFile', JSON.stringify({
                    type: 'save',
                    data: JSON.stringify(graph, null, 2)
                }));
            }
        })

        ipcRenderer.on('saveas', async (event, data) => {
            if (this.canvasRef.current !== null) {
                const graph = this.canvasRef.current.getCurrentGraph();
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
        const { width, height } = this.state;

        switch (data.type) {
            case GraphImportType.Extracter: graph = await extracterReportToGraph(data.src, width, height); break;
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
            <CausalCanvas
                ref={this.canvasRef}
                width={width}
                height={height}
                graph={graph}
            />
        </React.Fragment>

    }
}

export default App;


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

function susiExample() {
    const Exo_Suzi_Throws = createNode(-200, -200, 'Exo_Suzi_Throws', true, '', true);
    const Exo_Billy_Throws = createNode(200, -200, 'Exo_Billy_Throws', true, '', true);

    const Suzi_Throws = createNode(-200, 0, 'Suzi_Throws', true, 'Exo_Suzi_Throws', false);
    const Billy_Throws = createNode(200, 0, 'Billy_Throws', true, 'Exo_Billy_Throws', false);

    const Suzi_Hits = createNode(-150, 150, 'Suzi_Hits', true, 'Suzi_Throws', false);
    const Billy_Hits = createNode(150, 150, 'Billy_Hits', true, '!Suzi_Hits&Billy_Throws', false);

    const Bottel_Broken = createNode(0, 300, 'Bottel_Broken', true, 'Suzi_Hits|Billy_Hits', false);

    return {
        directed: true,
        title: 'Bottel',
        nodes: [
            Exo_Suzi_Throws, Exo_Billy_Throws,
            Suzi_Throws, Billy_Throws,
            Billy_Hits, Suzi_Hits,
            Bottel_Broken
        ],
    }
}

function createNode(x: number, y: number, title: string, value: boolean, formula: string, isExo: boolean): INode {
    return {
        x,
        y,
        title,
        value,
        id: title,
        formula,
        isExogenousVariable: isExo
    }
}