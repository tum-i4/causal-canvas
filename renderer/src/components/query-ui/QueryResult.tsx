import React, { Component } from 'react';
import styled from '../../style/theme/styled-components';
import ReactJson from 'react-json-view';
import { Scrollbars } from 'react-custom-scrollbars';
import _ from 'lodash';
import { IQueryData } from './QueryContainer';

const QueryResultContainer = styled.div<{ height: number, width: number }>`
    position: fixed;
    left: 0;
    bottom: 0;
    height: ${props => props.height}px;
    width: calc(100% - ${props => props.width}px);
    background-color: ${props => props.theme.colors.background};
    border-top: 1px solid ${props => props.theme.colors.primary};
    padding: 3px;
`

const RelativeContainer = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
`

const StepperContainer = styled.div`
    position: absolute;
    right: 5px;
    top: 10px;
`

const StepperIdxContainer = styled.div`
    position: absolute;
    right: 9px;
    top: 3px;
    color: ${props => props.theme.colors.primary};
`

const StepItem = styled.div`
    display: inline-block;
    font-size: 30px;
    cursor: pointer;
    color: ${props => props.theme.colors.primary};
`

const ReSetBtn = styled.div`
    position: absolute;
    top: 0px;
    left: calc(50% - 30px);
    font-size: 27px;
    display: inline-block;
    cursor: pointer;
    z-index: 100;
    color: ${props => props.theme.colors.primary};
`

interface IQueryResultState {
    idx: number;
    query: {
        query: object;
        result: object | null;
    }[];
}

interface IQueryResultProps {
    height: number;
    width: number;
    result: object;
    reSetQuery: (query: IQueryData) => void;
}

export class QueryResult extends Component<IQueryResultProps, IQueryResultState> {

    constructor(props) {
        super(props);

        this.state = {
            idx: 0,
            query: []
        }
    }

    componentDidUpdate(prevProps: IQueryResultProps) {

    }

    public addQuery(query: any) {
        this.setState({
            ...this.state,
            query: [...this.state.query, { query, result: null }],
            idx: this.state.query.length
        })

        return this.state.query.length;
    }

    public addResult(idx: number, result: any) {
        setTimeout(() => {
            this.setState({
                ...this.state,
                query: this.state.query.map((q, i) => i === idx ? { ...q, result } : q)
            })
        }, 500)
    }

    private incIdx = () => {
        const newIdx = this.state.idx + 1
        if (newIdx >= this.state.query.length) {
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

    onReSetClicked = () => {
        const { idx, query } = this.state;
        this.props.reSetQuery(query[idx].query as any)
    }

    public render() {

        const { height, width } = this.props;
        const { query, idx } = this.state;

        if (query.length === 0) {
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
                <ReSetBtn
                    onClick={this.onReSetClicked}
                >
                    ↻
                </ReSetBtn>
                <Scrollbars style={{ width: '50%', height: '100%' }}>
                    <ReactJson
                        src={query[idx].query || {}}
                        collapsed={1}
                        displayDataTypes={false}
                        enableClipboard={false}
                        name={'query'}
                    />
                </Scrollbars>
                <Scrollbars style={{ width: '50%', height: '100%' }}>
                    {
                        query[idx].result === null
                            ? 'Loading...'
                            : <ReactJson
                                src={query[idx].result || {}}
                                collapsed={1}
                                displayDataTypes={false}
                                enableClipboard={false}
                                name={'result'}
                            />
                    }
                </Scrollbars>
                {
                    query.length > 1
                        ? <React.Fragment>
                            <StepperContainer>
                                <StepItem onClick={this.decIdx}>🠸</StepItem>
                                <StepItem onClick={this.incIdx}>🠺</StepItem>
                            </StepperContainer>
                            <StepperIdxContainer>
                                {`${idx + 1}/${query.length}`}
                            </StepperIdxContainer>
                        </React.Fragment>
                        : null
                }
            </RelativeContainer>
        </QueryResultContainer>
    }
}