import React, { Component, createRef } from 'react';
import Graph from './graph/Graph';
import { IGraph } from '../types/GraphTypes';
import { Cmd } from './cmd/Cmd';

interface ICausalCanvasState {
    width: number;
    height: number;
}

interface ICausalCanvasProps {
    width: number;
    height: number;
    graph: IGraph;
}

class CausalCanvas extends Component<ICausalCanvasProps, ICausalCanvasState> {

    private graphRef = createRef<Graph>();

    constructor(props: ICausalCanvasProps) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
        }

    }

    componentDidMount() {
        //trigger rerender after ref is created
        this.setState(this.state);
    }

    componentWillUnmount() {
    }

    public getCurrentGraph = () => {
        if (this.graphRef.current !== null) {
            return this.graphRef.current.getCurrentGraph();
        }
    }


    render() {

        const { width, height, graph } = this.props;

        if (width === 0) {
            return null;
        }

        const cmd = this.graphRef.current !== null
            ? <Cmd graphRef={this.graphRef.current} />
            : null

        return <React.Fragment>
            <Graph
                ref={this.graphRef}
                width={width}
                height={height}
                data={graph}
            />
            {cmd}
        </React.Fragment>

    }
}

export default CausalCanvas;