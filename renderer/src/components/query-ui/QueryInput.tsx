import React, { Component } from 'react';
import styled from '../../style/theme/styled-components';
import Graph from '../graph/Graph';
import { Button, Select, Input, MenuItem } from '@material-ui/core';
import { NewFormulaInput } from '../formula-input/FormulaInput';
import { IQueryData } from './QueryContainer';
import { forumlaToJavaFormula } from '../util';
import { CauseListItem } from './CauseListItem';
import { Scrollbars } from 'react-custom-scrollbars';
import { QueryNodeInput } from './QueryNodeInput';

const QueryInputContainer = styled.div<{ width: number }>`
    position: fixed;
    right: 0;
    top: 0;
    width: ${props => props.width}px;
    height: 100%;
    background-color: ${props => props.theme.colors.background};
    border-left: 1px solid ${props => props.theme.colors.primary};
    padding: 10px;
`

const ButtonContainer = styled.div`
    text-align: center;
    margin-top: 22px;
    width: 100%;
`

const QueryButton = styled.div`
    text-align: cetner;
    padding: 5px 10px;
    border: 1px solid ${props => props.theme.colors.primary};
    border-radius: 3px;
    cursor: pointer;
    width: 120px;
    display: inline-block;
    background-color: ${props => props.theme.colors.highlightBackground};
`


const PhiContainer = styled.div`
    width: 100%;
    height: 40px;
`

const CauseContainer = styled.div`
    height: 180px;
    width: 100%;
    background-color: ${props => props.theme.colors.highlightBackground};
    margin-top: 3px;
    border-radius: 3px;
`

const Label = styled.div`
    font-size: 20px;
    margin: 7px 0;
`

const FirstLabel = styled.div`
    font-size: 20px;
    margin-bottom: 7px;
`

interface IQueryInputState {
    solvingStrategy: string;
    phi: string;
    causeSearch: string;
    cause: {
        name: string;
        value: boolean;
    }[];
    context: {
        name: string;
        value: boolean;
    }[];
}

interface IQueryInputProps {
    width: number;
    graph: Graph;
    query: (query: IQueryData) => void;
}

const SolvingStrategys = [
    'BRUTE_FORCE',
    'BRUTE_FORCE_OPTIMIZED_W',
    'SAT',
    'SAT_MINIMAL',
    'SAT_COMBINED',
    'SAT_COMBINED_MINIMAL',
    'SAT_OPTIMIZED_W',
    'SAT_OPTIMIZED_W_MINIMAL',
    'SAT_OPTIMIZED_FORMULAS',
    'SAT_OPTIMIZED_FORMULAS_MINIMAL',
    'SAT_OPTIMIZED_AC3',
    'SAT_OPTIMIZED_AC3_MINIMAL'
]

export class QueryInput extends Component<IQueryInputProps, IQueryInputState> {

    constructor(props: IQueryInputProps) {
        super(props);

        const context = props.graph.getCurrentGraph().nodes.filter(n => n.isExogenousVariable).map(n => ({ name: n.title, value: n.value }))

        this.state = {
            solvingStrategy: SolvingStrategys[0],
            phi: '',
            cause: [],
            causeSearch: '',
            context
        }
    }

    public setQuery = (data: IQueryData) => {
        this.setState({
            ...data
        })
    }


    onSolvingStrategyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            ...this.state,
            solvingStrategy: event.target.value
        })
    }

    onPhiUpdate = (phi: string) => {
        this.setState({
            ...this.state,
            phi
        })
    }

    onCauseSearchChange = (value: string) => {
        console.log(value);
        this.setState({
            ...this.state,
            causeSearch: value
        })
    }

    onCauseSearchSubmit = () => {
        this.setState({
            ...this.state,
            causeSearch: '',
            cause: [{
                name: this.state.causeSearch,
                value: true
            }, ...this.state.cause],
        })
    }

    removeCauseItem = (idx: number) => {
        this.setState({
            ...this.state,
            cause: this.state.cause.filter((v, i) => i !== idx)
        })
    }

    toggelCauseItem = (idx: number) => {
        this.setState({
            ...this.state,
            cause: this.state.cause.map((v, i) => i === idx ? { ...v, value: !v.value } : v)
        })
    }

    toggelContextItem = (idx: number) => {
        this.setState({
            ...this.state,
            context: this.state.context.map((v, i) => i === idx ? { ...v, value: !v.value } : v)
        })
    }

    onQueryClick = () => {

        const { phi, solvingStrategy, cause, context } = this.state;

        this.props.query({
            phi: forumlaToJavaFormula(phi),
            solvingStrategy,
            cause: cause,
            context
        });
    }

    public render() {

        const { solvingStrategy, phi, causeSearch, cause, context } = this.state;
        const { width } = this.props;

        return <QueryInputContainer
            width={width}
        >
            <Scrollbars style={{ width: '100%', height: '100%' }}>

                <FirstLabel>
                    Context
            </FirstLabel>
                <CauseContainer>
                    <Scrollbars style={{ width: '100%', height: '100%' }}>
                        {
                            context.map((c, idx) => <CauseListItem key={`context-${name}${idx}`} {...c} idx={idx} toggel={this.toggelContextItem} />)
                        }
                    </Scrollbars>
                </CauseContainer>
                <Label>
                    Cause
            </Label>
                <QueryNodeInput
                    value={causeSearch}
                    onChange={this.onCauseSearchChange}
                    onSubmit={this.onCauseSearchSubmit}
                    suggsestions={this.props.graph.getCurrentGraph().nodes.filter(n => !n.isExogenousVariable).map(n => n.title)}
                />
                <CauseContainer>
                    <Scrollbars style={{ width: '100%', height: '100%' }}>
                        {
                            cause.map((c, idx) => <CauseListItem key={`cause-${name}${idx}`} {...c} idx={idx} remove={this.removeCauseItem} toggel={this.toggelCauseItem} />)
                        }
                    </Scrollbars>
                </CauseContainer>
                <Label>
                    Phi
            </Label>
                <PhiContainer>
                    <NewFormulaInput
                        formula={phi}
                        onChange={this.onPhiUpdate}
                        nodes={this.props.graph.getCurrentGraph().nodes}
                    />
                </PhiContainer>
                <Label>
                    SolvingStrategy
            </Label>
                <Select
                    style={{
                        width: '100%'
                    }}
                    value={solvingStrategy}
                    onChange={this.onSolvingStrategyChange}
                    input={<Input name="age" id="age-helper" />}
                >
                    {SolvingStrategys.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
                <ButtonContainer>
                    <QueryButton
                        onClick={this.onQueryClick}
                    >
                        Query
                </QueryButton>
                </ButtonContainer>
            </Scrollbars>
        </QueryInputContainer>
    }
}