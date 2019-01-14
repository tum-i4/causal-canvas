import React, { Component } from 'react';
import styled from '../../style/theme/styled-components';
import ReactJson from 'react-json-view';
import { Scrollbars } from 'react-custom-scrollbars';
import _ from 'lodash';

const QueryResultContainer = styled.div<{ height: number, width: number }>`
    position: fixed;
    left: 0;
    bottom: 0;
    height: ${props => props.height}px;
    width: calc(100% - ${props => props.width}px);
    background-color: ${props => props.theme.colors.background};
    border-top: 1px solid ${props => props.theme.colors.primary};
`

const RelativeContainer = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
`

const StepperContainer = styled.div`
    position: absolute;
    right: 10px;
    top: 10px;
`

const StepperIdxContainer = styled.div`
    position: absolute;
    right: 13px;
    top: 3px;
`

const StepItem = styled.div`
    display: inline-block;
    font-size: 30px;
`

interface IQueryResultState {
    idx: number;
    results: object[];
}

interface IQueryResultProps {
    height: number;
    width: number;
    result: object;
}

export class QueryResult extends Component<IQueryResultProps, IQueryResultState> {

    constructor(props) {
        super(props);

        this.state = {
            idx: 0,
            results: []
        }
    }

    componentDidUpdate(prevProps: IQueryResultProps) {
        if (!_.isMatch(prevProps.result, this.props.result)) {
            this.setState({
                ...this.state,
                results: [this.props.result, ...this.state.results],
                idx: this.state.results.length
            })
        }
    }

    private incIdx = () => {
        const newIdx = this.state.idx + 1
        if (newIdx >= this.state.results.length) {
            return;
        }
        this.setState({
            ...this.state,
            idx: newIdx
        })
    }

    private decIdx = () => {
        const newIdx = this.state.idx - 1
        if (newIdx < 0) {
            return;
        }
        this.setState({
            ...this.state,
            idx: newIdx
        })
    }

    public render() {

        const { height, width } = this.props;
        const { results, idx } = this.state;

        if (results.length === 0) {
            return <QueryResultContainer
                height={height}
                width={width}
            ></QueryResultContainer>
        }

        return <QueryResultContainer
            height={height}
            width={width}
        >
            <RelativeContainer>
                <Scrollbars style={{ width: '100%', height: '100%' }}>
                    <ReactJson
                        src={results[idx] || {}}
                        collapsed={1}
                        displayDataTypes={false}
                    />
                </Scrollbars>
                {
                    results.length > 1
                        ? <React.Fragment>
                            <StepperContainer>
                                <StepItem onClick={this.decIdx}>🠸</StepItem>
                                <StepItem onClick={this.incIdx}>🠺</StepItem>
                            </StepperContainer>
                            <StepperIdxContainer>
                                {`${idx + 1}/${results.length}`}
                            </StepperIdxContainer>
                        </React.Fragment>
                        : null
                }
            </RelativeContainer>
        </QueryResultContainer>
    }
}