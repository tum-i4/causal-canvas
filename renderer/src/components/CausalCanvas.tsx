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

enum CanvasModus {
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
    graph: IGraph;
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

class CausalCanvas extends Component<ICausalCanvasProps, ICausalCanvasState> {

    private graphRef = createRef<Graph>();
    private queryWidth = 350;
    private queryHeight = 230;

    constructor(props: ICausalCanvasProps) {
        super(props);

        this.state = {
            modus: CanvasModus.Edit,
            graphs: [this.makeNewGraphState(props.graph)],
            selected: 0
        }

    }

    componentDidMount() {
        //trigger rerender after ref is created
        this.setState(this.state);
    }

    componentWillUnmount() {
    }

    componentDidUpdate(lastProps: ICausalCanvasProps) {
        if (!_.isMatch(lastProps.graph, this.props.graph)) {
            this.setState({
                ...this.state,
                graphs: [...this.state.graphs, this.makeNewGraphState(this.props.graph)],
                selected: this.state.graphs.length
            })
        }
    }

    private makeNewGraphState(graph: IGraph) {
        return {
            id: uuid.v4(),
            graph,
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

    render() {

        const { modus, graphs, selected } = this.state;
        const { width, height } = this.props;

        if (width === 0) {
            return null;
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
            />
            <Graph
                ref={this.graphRef}
                width={width - this.queryWidth * modus}
                height={height - this.queryHeight * modus}
                data={selectedGraph}
                graphChanged={this.onGraphChanged}
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