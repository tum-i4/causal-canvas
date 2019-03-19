import React, { Component, createRef } from 'react';
import Graph, { ISelect } from './graph/Graph';
import { IGraph, IPoint } from '../types/GraphTypes';
import { Cmd } from './cmd/Cmd';
import styled from '../style/theme/styled-components';
import { QueryContainer } from './query-ui/QueryContainer';
import { TabBar } from './TabBar';
import * as _ from 'lodash';
import { IFilter } from './graph/FilterList';
import { zoomIdentity } from 'd3';
import uuid from 'uuid';
import { WelcomePage } from './WelcomePage';

export enum CanvasModus {
    Edit,
    Query
}

interface ICausalCanvasState {
    modus: CanvasModus;
    graphs: IGraphData[];
    selected: number;
}

export interface IGraphData {
    id: string;
    graph: IGraph;
    changed: boolean;
    areaSelect: {
        source: IPoint;
        target: IPoint;
    },
    filter: {
        highlight: IFilter[]
    },
    zoomTransform: d3.ZoomTransform;
    selected: ISelect;

}

interface ICausalCanvasProps {
    width: number;
    height: number;
    graph: IGraph | null;
}

const CanvasModusToggelButton = styled.div<any>`
    display: inline-block;
    position: fixed;
    width: 40px;
    height: 40px;
    bottom: ${props => props.bottom + 5}px;
    right: ${props => props.right + 5}px;
    opacity: ${props => props.modus === CanvasModus.Query ? 1 : 0.65};
    font-size: 30px;
    cursor: pointer;
`
import { IpcRenderer } from 'electron';
const electron = (window as any).require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer: IpcRenderer = electron.ipcRenderer;

class CausalCanvas extends Component<ICausalCanvasProps, ICausalCanvasState> {

    private graphRef = createRef<Graph>();
    private queryWidth = 350;
    private queryHeight = 230;

    constructor(props: ICausalCanvasProps) {
        super(props);

        this.state = {
            modus: CanvasModus.Edit,
            graphs: props.graph !== null ? [this.makeNewGraphState(props.graph)] : [],
            selected: 0
        }

    }

    componentDidMount() {
        ipcRenderer.on('toggel-modus', () => this.toggelModus());
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('toggel-modus');
    }

    componentDidUpdate(lastProps: ICausalCanvasProps) {
        if (this.props.graph === null) {
            return;
        }

        if (lastProps.graph === null || lastProps.graph.id !== this.props.graph.id) {
            this.setState({
                ...this.state,
                graphs: [...this.state.graphs, this.makeNewGraphState(this.props.graph)],
                selected: this.state.graphs.length
            })
        }
    }

    private rerender = () => {
        this.setState({ ...this.state })
    }

    private makeNewGraphState(graph: IGraph) {
        return {
            id: uuid.v4(),
            graph: _.cloneDeep(graph),
            selected: {
                nodes: [],
                edges: []
            },
            newEdge: null,
            areaSelect: {
                source: { x: -1, y: -1 },
                target: { x: -1, y: -1 }
            },
            filter: {
                highlight: []
            },
            zoomTransform: zoomIdentity,
            changed: false,
        }
    }

    public makeNewEmptyTab = () => {
        this.setState({
            ...this.state,
            graphs: [...this.state.graphs, this.makeNewGraphState({
                id: uuid.v4(),
                directed: true,
                nodes: [],
                title: 'new-graph-' + this.state.graphs.length
            })],
            selected: this.state.graphs.length
        })
    }

    public getCurrentGraph = () => {
        if (this.graphRef.current !== null) {
            this.setState({
                graphs: this.state.graphs.map((g, idx) => idx === this.state.selected ? { ...g, changed: false } : g)
            });
            return this.graphRef.current.getCurrentGraph();
        }
    }

    public getCurrentID = () => {
        return this.state.graphs[this.state.selected].id;
    }

    public toggelModus = () => {
        this.setState({
            ...this.state,
            modus: this.state.modus === CanvasModus.Edit ? CanvasModus.Query : CanvasModus.Edit
        })
    }

    private closeTab = (idx: number) => {

        let selected = this.state.selected;
        const newGrapfs = this.state.graphs.filter((g, i) => i !== idx);
        if (idx === selected) {
            if (selected + 1 < newGrapfs.length) {
                selected++;
            } else if (selected - 1 > 0) {
                selected--;
            } else {
                selected = 0;
            }
        }

        this.setState({
            ...this.state,
            graphs: newGrapfs,
            selected
        });
    }

    onTabChange = (idx: number) => {

        if (this.graphRef.current === null) {
            return;
        }

        if (idx === this.state.selected) {
            return;
        }

        const graphs = this.state.graphs.map((g, _idx) => {
            if (_idx === this.state.selected) {
                return { ...g, ...this.graphRef.current!.getCurrentState(), changed: g.changed }
            }
            return g;
        })

        this.setState({
            ...this.state,
            selected: idx,
            graphs,
            modus: CanvasModus.Edit
        })
    }

    onGraphChanged = () => {
        this.setState({
            graphs: this.state.graphs.map((g, idx) => idx === this.state.selected ? { ...g, changed: true } : g)
        })
    }

    onGraphTitleChanged = (id: string, title: string) => {
        this.setState({
            graphs: this.state.graphs.map((g) => g.id === id ? { ...g, graph: { ...g.graph, title }, changed: true } : g)
        })
    }

    render() {

        const { modus, graphs, selected } = this.state;
        const { width, height } = this.props;

        if (width === 0) {
            return null;
        }

        if (graphs.length === 0) {
            return <WelcomePage />
        }

        const cmd = this.graphRef.current !== null
            ? <Cmd graphRef={this.graphRef.current} />
            : null


        const { changed, id, ...selectedGraph } = graphs[selected]
        return <React.Fragment>
            <TabBar
                graphs={graphs}
                selected={selected}
                onChange={this.onTabChange}
                newGraph={this.makeNewEmptyTab}
                closeTab={this.closeTab}
                onGraphChanged={this.onGraphTitleChanged}
            />
            <Graph
                rerender={this.rerender}
                ref={this.graphRef}
                width={width - this.queryWidth * modus}
                height={height - this.queryHeight * modus}
                data={selectedGraph}
                graphChanged={this.onGraphChanged}
                modus={modus}
            />
            {cmd}
            <CanvasModusToggelButton
                right={this.queryWidth * modus}
                bottom={this.queryHeight * modus}
                modus={modus}
                onClick={this.toggelModus}
            >
                {modus === CanvasModus.Edit ? '✎' : '×'}
            </CanvasModusToggelButton>
            {
                modus === CanvasModus.Query && this.graphRef.current !== null
                    ? <QueryContainer
                        width={this.queryWidth}
                        height={this.queryHeight}
                        graph={this.graphRef.current}
                    />
                    : null
            }
        </React.Fragment>

    }
}

export default CausalCanvas;