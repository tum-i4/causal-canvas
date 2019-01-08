import React, { Component } from 'react';
import { IGraph, IPoint, INode, IEdge, IDrawEdge } from '../../types/GraphTypes';
import * as _ from 'lodash';
import { Node } from './Node';
import { Edge } from './Edge';
import * as uuid from 'uuid';
import { AreaSelection } from './SelectionArea';
import { getSelectdFromArea } from './helper/areaSelection';
import { InfoPanel } from './InfoPanel';
import { FormulaInput } from './FormulaInput';
import { graphToDrawGraph } from '../../graph-layout/graphToDrawGraph';
import { cmdEvent, CmdTypes } from '../cmd/CmdEvent';
import { cmd_goto } from '../cmd/cmd-actions/goto';
import styled from '../../style/theme/styled-components';
import { getSubTree } from '../cmd/cmd-actions/getSubTree';
import { cmd_hightligt } from '../cmd/cmd-actions/highlight';
import { cmd_set } from '../cmd/cmd-actions/set';
import { IFilter, FilterList } from './FilterList';
import { Cmd } from '../cmd/Cmd';
import { NewFormulaInput } from '../formula-input/FormulaInput';

const SVG = styled.svg`
    background-color: ${props => props.theme.colors.background}
`


export interface IGraphProps {
    data: IGraph;
    height: number;
    width: number;
}

export interface IGraphState {
    graph: IGraph;
    viewPos: IPoint;
    selected: ISelect;
    newEdge: IDrawEdge | null;
    areaSelect: {
        source: IPoint;
        target: IPoint;
    },
    filter: {
        highlight: IFilter[]
    }
}

export interface ISelect {
    nodes: string[];
    edges: string[];
}

export enum MoveType {
    None,
    View,
    NewEdge,
    Selection,
    AreaSelect
}

class Graph extends Component<IGraphProps, IGraphState> {

    private svgRef = React.createRef<SVGSVGElement>();
    private lastPos: IPoint = { x: -1, y: -1 };
    private moveType: MoveType = MoveType.None;

    constructor(props: any) {
        super(props);

        this.state = {
            graph: _.cloneDeep(this.props.data),
            viewPos: {
                x: 0,
                y: 0
            },
            selected: {
                nodes: [],
                edges: []
            },
            newEdge: null,
            areaSelect: {
                source: this.getResetPosition(),
                target: this.getResetPosition()
            },
            filter: this.getInitFilter()

        }

    }

    private getInitFilter() {
        return {
            highlight: []
        }
    }

    public getCurrentGraph(): IGraph {
        return this.state.graph;
    }

    public applyCommand = (cmd: { type: CmdTypes, args: string[] }) => {

        const { viewPos, graph: { nodes } } = this.state;
        let changes: any;

        switch (cmd.type) {
            case CmdTypes.GOTO: changes = {
                viewPos: cmd_goto(cmd.args, nodes, viewPos)
            }; break;
            case CmdTypes.HIGHLIGHT: changes = {
                filter: {
                    ...this.state.filter,
                    highlight: [...this.state.filter.highlight, cmd_hightligt(cmd.args, nodes)].filter(h => h !== undefined)
                }
            }; break;
            case CmdTypes.SET: changes = {
                graph: {
                    ...this.state.graph,
                    nodes: cmd_set(cmd.args, nodes)
                }
            }; break;
            case CmdTypes.RESET: changes = {
                filter: this.getInitFilter()
            }; break;
        }

        this.setState({
            ...this.state,
            ...changes
        });
    }

    componentDidMount() {
        window.addEventListener('keyup', this.onKeyUp);
        cmdEvent.on('cmd', this.applyCommand);
    }

    componentWillUnmount() {

        cmdEvent.removeListener('cmd', this.applyCommand);
        window.removeEventListener('keyup', this.onKeyUp);
        this.removeMouseMoveEvent();
    }

    componentDidUpdate(prevProps: IGraphProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                graph: _.cloneDeep(this.props.data),
                viewPos: {
                    x: 0,
                    y: 0
                },
                selected: {
                    nodes: [],
                    edges: []
                },
                newEdge: null,
                areaSelect: {
                    source: this.getResetPosition(),
                    target: this.getResetPosition()
                }
            })
        }
    }

    getResetPosition = () => ({ x: -1, y: -1 });

    addMouseMoveEvent = (moveType: MoveType) => {
        if (this.svgRef.current === null) {
            return;
        }
        this.moveType = moveType;
        this.svgRef.current.addEventListener('mousemove', this.onMouseMove);
    }

    removeMouseMoveEvent = (resetState: boolean = true) => {
        //reset stuff
        this.lastPos = this.getResetPosition();
        this.moveType = MoveType.None;
        if (resetState) {
            this.setState({ newEdge: null, areaSelect: { source: this.getResetPosition(), target: this.getResetPosition() } })
        }

        if (this.svgRef.current === null) {
            return;
        }
        this.svgRef.current.removeEventListener('mousemove', this.onMouseMove);
    }

    onMouseMove = (event: MouseEvent) => {

        const delta = this.calcMouseDelta(event);

        switch (this.moveType) {
            case MoveType.View: return this.moveView(delta);
            case MoveType.Selection: return this.moveSelection(delta);
            case MoveType.NewEdge: return this.moveNewEdge(event);
            case MoveType.AreaSelect: return this.moveAreaSelection(event);
            case MoveType.None: return;
        }
    }

    moveAreaSelection = (event: MouseEvent) => {
        const { areaSelect } = this.state;
        this.setState({
            ...this.state,
            areaSelect: {
                ...areaSelect,
                target: {
                    x: event.pageX,
                    y: event.pageY,
                }
            }
        })
    }

    moveView = (delta: IPoint) => {
        const { viewPos } = this.state;
        this.setState({
            ...this.state,
            viewPos: {
                x: viewPos.x - delta.x,
                y: viewPos.y - delta.y,
            }
        })
    }

    moveNewEdge = (event: MouseEvent) => {
        const { newEdge, viewPos } = this.state;
        this.setState({
            ...this.state,
            newEdge: {
                ...newEdge!,
                target: {
                    ...newEdge!.target,
                    x: event.pageX - viewPos.x - this.props.width / 2,
                    y: event.pageY - viewPos.y - this.props.height / 2
                }
            }
        })
    }

    moveSelection = (delta: IPoint) => {
        const { graph, selected } = this.state;

        const nodes = graph.nodes.map(
            node => selected.nodes.includes(node.id)
                ? {
                    ...node,
                    x: node.x - delta.x,
                    y: node.y - delta.y
                }
                : node
        )

        this.setState({
            ...this.state,
            graph: {
                ...graph,
                nodes
            }
        })
    }

    calcMouseDelta(event: MouseEvent): IPoint {

        const delta = { x: 0, y: 0 };

        if (this.lastPos.x !== -1) {
            delta.x = this.lastPos.x - event.pageX;
            delta.y = this.lastPos.y - event.pageY;
        }

        this.lastPos = { x: event.pageX, y: event.pageY }
        return delta;
    }

    select = (event: React.MouseEvent, selected: ISelect) => {
        this.setState({
            ...this.state,
            selected: {
                nodes: [
                    ...(event.ctrlKey ? this.state.selected.nodes : []),
                    ...selected.nodes
                ],
                edges: [
                    ...(event.ctrlKey ? this.state.selected.edges : []),
                    ...selected.edges
                ]
            }
        })
    }

    getNodeByID = (id: string): INode | undefined => {
        return this.state.graph.nodes.find(node => node.id === id);
    }

    createNewNode = (ev: React.MouseEvent) => {
        if (!ev.shiftKey) {
            return;
        }

        const { graph, viewPos } = this.state;

        const id = uuid.v4().substring(0, 3);
        const newNode: INode = {
            id,
            x: ev.pageX - viewPos.x - this.props.width / 2,
            y: ev.pageY - viewPos.y - this.props.height / 2,
            title: id,
            value: true,
            formula: '',
            isExogenousVariable: false
        }

        this.setState({
            graph: {
                ...graph,
                nodes: [...graph.nodes, newNode]
            }
        })
    }

    deleteSelected = () => {

        const { graph, selected } = this.state;

        const newNodes = graph.nodes.filter(node => !selected.nodes.includes(node.id));
        // const newEdges = graph.edges
        //     .filter(edge=>!selected.edges.includes(edge.id))
        //     .filter(edge=>!selected.nodes.includes(edge.source) && !selected.nodes.includes(edge.target))

        this.setState({
            ...this.state,
            graph: {
                ...graph,
                nodes: newNodes,
                // edges: newEdges
            },
            selected: {
                nodes: [],
                edges: []
            }
        })
    }

    startNewEdge = (sourceID: string) => {

        const source = this.getNodeByID(sourceID)!;
        this.setState({
            ...this.state,
            newEdge: {
                source,
                target: _.cloneDeep(source),
                id: 'new-edge-temp'
            }
        })
        this.addMouseMoveEvent(MoveType.NewEdge);
    }

    endNewEdge = (targetID: string) => {

        const { newEdge, graph } = this.state;

        if (newEdge === null) {
            return;
        }

        console.log('newEdge', newEdge.source.id, targetID);

        if (newEdge.source.id !== targetID) {
            const nodes = graph.nodes.map(node => node.id === newEdge.source.id && !node.isExogenousVariable ? {
                ...node,
                formula: node.formula === '' ? targetID : node.formula + '|' + targetID
            } : node)
            this.setState({
                ...this.state,
                graph: {
                    ...graph,
                    nodes
                }
            })
            return this.removeMouseMoveEvent(false);
        }

        this.removeMouseMoveEvent();
    }

    onKeyUp = (event: KeyboardEvent) => {
        if (event.key === 'Delete') {
            this.deleteSelected();
        }
    }

    onMouseDown = (ev: React.MouseEvent<SVGSVGElement>) => {

        if (ev.shiftKey) {
            return;
        }

        if (ev.ctrlKey) {
            this.addMouseMoveEvent(MoveType.View);
            return;
        }

        this.setState({
            ...this.state,
            areaSelect: {
                source: {
                    x: ev.pageX,
                    y: ev.pageY,
                },
                target: {
                    x: ev.pageX,
                    y: ev.pageY,
                }
            }
        })

        this.addMouseMoveEvent(MoveType.AreaSelect);
        return;
    }

    onMouseUp = (ev: React.MouseEvent<SVGSVGElement>) => {

        if (ev.shiftKey) {
            this.createNewNode(ev);
            return;
        }
        if (this.moveType === MoveType.AreaSelect) {
            this.removeMouseMoveEvent(false);

            const { graph: { nodes }, areaSelect, viewPos } = this.state;

            this.setState({
                ...this.state,
                areaSelect: { source: this.getResetPosition(), target: this.getResetPosition() },
                selected: getSelectdFromArea(nodes, areaSelect, viewPos, this.props.width, this.props.height)
            })

            return;
        }

        this.removeMouseMoveEvent();
    }

    updateNode = (updatedNode: INode) => {
        this.setState({
            ...this.state,
            graph: {
                ...this.state.graph,
                nodes: this.state.graph.nodes.map(node => node.id === updatedNode.id ? updatedNode : node)
            }
        })
    }

    removeFilter = (id: string) => {
        this.setState({
            ...this.state,
            filter: {
                ...this.state.filter,
                highlight: this.state.filter.highlight.filter(h => h.id !== id)
            }
        })
    }

    render() {

        const { height, width } = this.props;
        const { graph, viewPos, selected, newEdge, areaSelect, filter: { highlight } } = this.state;

        const drawGraph = graphToDrawGraph(graph);
        const formularNodes = getSubTree(graph.nodes, selected.nodes);

        const highlightSet = new Set<string>();
        highlight.forEach(h => h.applyTo.forEach(a => highlightSet.add(a)));

        const nodes = drawGraph.nodes.map(
            (node, idx) => <Node
                key={node.id}
                {...node}
                select={this.select}
                selected={selected.nodes.includes(node.id)}
                dragStart={this.addMouseMoveEvent}
                startNewEdge={this.startNewEdge}
                endNewEdge={this.endNewEdge}
                markAsPartOfFormular={formularNodes.has(node.id)}
                isNotHighlight={highlight.length === 0 ? false : !highlightSet.has(node.id)}
            />
        )

        const edges = drawGraph.edges
            .map(
                (edge, idx) => <Edge
                    key={edge.id}
                    {...edge}
                    select={this.select}
                    selected={false}
                    isNotHighlight={highlight.length === 0 ? false : !highlightSet.has(edge.source.id) && !highlightSet.has(edge.target.id)}
                />
            )

        const newEdgeComponent = newEdge === null
            ? null
            : <Edge
                isNotHighlight={false}
                isNewEge={true}
                key={newEdge.id}
                {...newEdge}
                select={this.select}
                selected={false}
            />

        const areaSelection = <AreaSelection {...areaSelect} viewPos={viewPos} sWidth={width} sHeight={height} />

        const selectedNodes = graph.nodes.filter(n => selected.nodes.includes(n.id));
        return (
            <React.Fragment>
                <SVG
                    ref={this.svgRef}
                    width={width}
                    height={height}
                    viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                >
                    <pattern id="simple-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle fill="#9c9c9c" cx="10" cy="10" r="1" />
                    </pattern>
                    <rect
                        x={-width}
                        y={-height}
                        transform={`translate(${viewPos.x % width / 2},${viewPos.y % height / 2})`}
                        style={{ pointerEvents: "none" }}
                        width={width * 2} height={height * 2}
                        fill="url(#simple-dots)"
                    />
                    <g
                        transform={`translate(${viewPos.x},${viewPos.y})`}
                    >
                        {edges}
                        {nodes}
                        {areaSelection}
                        {newEdgeComponent}
                    </g>
                </SVG>
                {
                    selected.nodes.length === 1
                        ? <React.Fragment key={selectedNodes[0].id}>
                            <InfoPanel applyNodeChanges={this.updateNode} node={selectedNodes[0]} />
                            {/* {
                                !selectedNodes[0].isExogenousVariable ? <FormulaInput applyNodeChanges={this.updateNode} node={selectedNodes[0]} /> : null
                            } */}
                            {
                                !selectedNodes[0].isExogenousVariable ? <NewFormulaInput formula={selectedNodes[0].formula} /> : null
                            }
                        </React.Fragment>
                        : null
                }
                <FilterList filters={highlight} removeFilter={this.removeFilter} />
                <Cmd nodes={graph.nodes.map(n => n.title)} />
            </React.Fragment>
        )
    }
}

export default Graph;