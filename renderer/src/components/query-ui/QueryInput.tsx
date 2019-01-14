import React, { Component } from 'react';
import styled from '../../style/theme/styled-components';
import Graph from '../graph/Graph';
import { Button, FormControl, InputLabel, Select, Input, MenuItem, FormHelperText, TextField } from '@material-ui/core';
import { NewFormulaInput } from '../formula-input/FormulaInput';
import { IQueryData } from './QueryContainer';
import { forumlaToJavaFormula } from '../util';
import { CauseListItem } from './CauseListItem';
import { Scrollbars } from 'react-custom-scrollbars';

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
    margin-top: 10px;
    width: 100%;
`

const PhiContainer = styled.div`
    width: 100%;
    height: 40px;
`

const CauseContainer = styled.div`
    height: 180px;
    width: 100%;
`

const CauseSearchInput = styled.input`
    width: 100%;
    height: 40px;
    text-align: left;
    //word-spacing: 5px;
    font-size: 20px;
    border: solid 1px ${props => props.theme.colors.primary};
    outline: none;
    &:focus{
        outline: none;
    }
    border-radius: 3px;
`

const Label = styled.div`
    font-size: 20px;
    margin: 10px 0;
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

    onCauseSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            causeSearch: event.target.value
        })
    }

    onCauseSearchKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            this.setState({
                ...this.state,
                cause: [{
                    name: this.state.causeSearch,
                    value: true
                }, ...this.state.cause],
                causeSearch: ''
            })
        }
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
            <Label>
                Context
            </Label>
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
            <CauseSearchInput
                value={causeSearch}
                onChange={this.onCauseSearchChange}
                onKeyUp={this.onCauseSearchKeyUp}
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.onQueryClick}
                >
                    Query
                </Button>
            </ButtonContainer>
        </QueryInputContainer>
    }
}