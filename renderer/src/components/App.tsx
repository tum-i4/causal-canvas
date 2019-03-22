import React, { Component, createRef } from 'react';
import { IGraph, INode } from '../types/GraphTypes';
import _ from 'lodash';
import { extracterReportToGraph } from '../converter/import/extracterReportToGraph';
import CausalCanvas from './CausalCanvas';
import { Settings } from './settings/Settings';
import { ThemeProvider } from '../style/theme/styled-components';
import { BasicTheme } from '../style/theme/themes/basic.theme';
import { ITheme } from '../style/theme/Theme';
import { IGeneralSettings, GeneralSettingsDefault } from './settings/GeneralSettings';
import { layoutGraph } from '../graph-layout/layoutGraph';
import { dotToGraph } from '../converter/import/dotToGraph';
import { IpcRenderer } from 'electron';
import * as uuid from 'uuid';
const electron = (window as any).require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer: IpcRenderer = electron.ipcRenderer;

enum AppView {
    Graph,
    Settings
}

interface ICausalCanvasState {
    width: number;
    height: number;
    graph: IGraph | null;
    appView: AppView;
    settings: {
        style: ITheme;
        general: IGeneralSettings;
    }
}

export enum GraphImportType {
    Extracter,
    Dot,
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

        let style = _.cloneDeep(BasicTheme);
        const savedStyle = window.localStorage.getItem('style');
        if (savedStyle !== null) {
            style = JSON.parse(savedStyle);
        }

        let general = _.cloneDeep(GeneralSettingsDefault);
        const savedGeneral = window.localStorage.getItem('general');
        if (savedGeneral !== null) {
            general = JSON.parse(savedGeneral);
        }

        this.state = {
            width: 0,
            height: 0,
            graph: null,
            appView: AppView.Graph,
            settings: {
                style: style,
                general: general
            }
        }

        this.updateWindowDimensions = _.debounce(this.updateWindowDimensions, 200);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        ipcRenderer.on('import', async (event, data) => this.handelGraphImport(JSON.parse(data)));

        ipcRenderer.on('showExample', async (event, data) => this.setState({ graph: susiExample() }));

        ipcRenderer.on('save', async (event, data) => {
            if (this.canvasRef.current !== null) {
                const graph = this.canvasRef.current.getCurrentGraph();
                ipcRenderer.send('saveToFile', JSON.stringify({
                    type: 'save',
                    id: this.canvasRef.current.getCurrentID(),
                    data: JSON.stringify(graph, null, 2)
                }));
            }
        })

        ipcRenderer.on('saveas', async (event, data) => {
            if (this.canvasRef.current !== null) {
                const graph = this.canvasRef.current.getCurrentGraph();
                ipcRenderer.send('saveToFile', JSON.stringify({
                    type: 'saveas',
                    id: this.canvasRef.current.getCurrentID(),
                    data: JSON.stringify(graph, null, 2)
                }));
            }
        })

        ipcRenderer.on('new-file', () => {
            if (this.canvasRef.current !== null) {
                this.canvasRef.current.makeNewEmptyTab();
            }
        })

        ipcRenderer.on('settings', (event, data) => {
            this.setState({
                ...this.state,
                appView: AppView.Settings
            })
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        ipcRenderer.removeAllListeners('settings');
        ipcRenderer.removeAllListeners('new-file');
        ipcRenderer.removeAllListeners('saveas');
        ipcRenderer.removeAllListeners('save');
        ipcRenderer.removeAllListeners('import');
        ipcRenderer.removeAllListeners('showExample');
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handelGraphImport = async (data: IGraphImportData) => {

        let graph: IGraph | null = null;
        const { width, height, settings: { general } } = this.state;

        switch (data.type) {
            case GraphImportType.Extracter:
                graph = await layoutGraph(extracterReportToGraph(data.src), general, width, height); break;
            case GraphImportType.Dot:
                graph = await layoutGraph(dotToGraph(data.src), general, width, height); break;
            case GraphImportType.CausalModel: graph = JSON.parse(data.src); break;
        }

        console.log({ graph, data });
        if (graph !== null) {
            if (graph.title === 'null') {
                graph.title = `untitled`;
            }
            this.setState({ graph });
        }
    }

    updateSettings = (key: string, obj: any) => {
        this.setState({
            ...this.state,
            settings: {
                ...this.state.settings,
                [key]: obj
            }
        })
    }

    closeSettings = () => {
        this.setState({
            ...this.state,
            appView: AppView.Graph
        })
    }

    render() {

        const { width, height, graph, appView, settings: { style, general } } = this.state;

        if (width === 0) {
            return null;
        }

        let body: any = null;

        if (appView === AppView.Graph) {
            body = <CausalCanvas
                ref={this.canvasRef}
                width={width}
                height={height}
                graph={graph}
            />
        } else if (appView === AppView.Settings) {
            body = <Settings
                style={style}
                onUpdate={this.updateSettings}
                close={this.closeSettings}
                general={general as any}
            />
        }

        return <React.Fragment>
            <ThemeProvider theme={style}>
                {
                    body
                }
            </ThemeProvider>
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
        id: "spoüpsi909",
        directed: true,
        title: 'test',
        nodes: [nodeA, nodeB, nodeC],
    }
}

function susiExample() {
    const Exo_Suzi_Throws = createNode(-200, -200, 'Exo_Suzy_Throws', true, '', true);
    const Exo_Billy_Throws = createNode(200, -200, 'Exo_Billy_Throws', true, '', true);

    const Suzi_Throws = createNode(-200, 0, 'Suzy_Throws', true, 'Exo_Suzy_Throws', false);
    const Billy_Throws = createNode(200, 0, 'Billy_Throws', true, 'Exo_Billy_Throws', false);

    const Suzi_Hits = createNode(-150, 150, 'Suzy_Hits', true, 'Suzy_Throws', false);
    const Billy_Hits = createNode(150, 150, 'Billy_Hits', true, '!Suzy_Hits&Billy_Throws', false);

    const Bottel_Broken = createNode(0, 300, 'Bottel_Broken', true, 'Suzy_Hits|Billy_Hits', false);

    return {
        id: uuid.v4(),
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