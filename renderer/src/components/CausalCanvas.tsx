import React, { Component, createRef } from 'react';
import Graph from './graph/Graph';
import { IGraph } from '../types/GraphTypes';
import { Cmd } from './cmd/Cmd';
import styled from '../style/theme/styled-components';
import { QueryContainer } from './query-ui/QueryContainer';

enum CanvasModus {
    Edit,
    Query
}

interface ICausalCanvasState {
    width: number;
    height: number;
    modus: CanvasModus;
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
            width: 0,
            height: 0,
            modus: CanvasModus.Query
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

    public toggelModus = () => {
        this.setState({
            ...this.state,
            modus: this.state.modus === CanvasModus.Edit ? CanvasModus.Query : CanvasModus.Edit
        })
    }


    render() {

        const { modus } = this.state;
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
                width={width - this.queryWidth * modus}
                height={height - this.queryHeight * modus}
                data={graph}
            />
            {cmd}
            <CanvasModusToggelButton
                right={this.queryWidth * modus}
                bottom={this.queryHeight * modus}
                modus={modus}
                onClick={this.toggelModus}
            >
                ✎
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