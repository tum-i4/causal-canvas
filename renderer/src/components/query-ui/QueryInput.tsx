import React, { Component } from 'react';
import styled from '../../style/theme/styled-components';
import Graph from '../graph/Graph';
import { Button, FormControl, InputLabel, Select, Input, MenuItem, FormHelperText } from '@material-ui/core';
import { NewFormulaInput } from '../formula-input/FormulaInput';
import { IQueryData } from './QueryContainer';
import { forumlaToJavaFormula } from '../util';

const QueryInputContainer = styled.div<{ width: number }>`
    position: fixed;
    right: 0;
    top: 0;
    width: ${props => props.width}px;
    height: 100%;
    background-color: ${props => props.theme.colors.background};
    border-left: 1px solid ${props => props.theme.colors.primary};
`

const ButtonContainer = styled.div`
    position: absolute;
    bottom: 20px;
    text-align: center;
    width: 100%;
`

const PhiContainer = styled.div`
    width: 90%;
    height: 40px;
`

interface IQueryInputState {
    solvingStrategy: string;
    phi: string;
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

        this.state = {
            solvingStrategy: SolvingStrategys[0],
            phi: ''
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

    onQueryClick = () => {

        const { phi, solvingStrategy } = this.state;
        const graph = this.props.graph.getCurrentGraph();

        this.props.query({
            phi: forumlaToJavaFormula(phi),
            solvingStrategy,
            cause: [{ name: 'Suzi_Throws', value: true }],
            context: graph.nodes.filter(n => n.isExogenousVariable).map(n => ({ name: n.title, value: n.value }))
        });
    }

    public render() {

        const { solvingStrategy, phi } = this.state;
        const { width } = this.props;

        return <QueryInputContainer
            width={width}
        >
            <FormControl >
                <InputLabel htmlFor="age-helper">SolvingStrategy</InputLabel>
                <Select
                    value={solvingStrategy}
                    onChange={this.onSolvingStrategyChange}
                    input={<Input name="age" id="age-helper" />}
                >
                    {SolvingStrategys.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
            </FormControl>
            <PhiContainer>
                <NewFormulaInput
                    formula={phi}
                    onChange={this.onPhiUpdate}
                    nodes={this.props.graph.getCurrentGraph().nodes}
                />
            </PhiContainer>

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