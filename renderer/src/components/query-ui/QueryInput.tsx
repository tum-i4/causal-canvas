import React, { Component } from 'react';
import styled from '../../style/theme/styled-components';
import Graph from '../graph/Graph';
import { Button, FormControl, InputLabel, Select, Input, MenuItem, FormHelperText } from '@material-ui/core';

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

interface IQueryInputState {
    solvingStrategy: string;
}

interface IQueryInputProps {
    width: number;
    graph: Graph;
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
            solvingStrategy: SolvingStrategys[0]
        }
    }


    onSolvingStrategyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            ...this.state,
            solvingStrategy: event.target.value
        })
    }

    public render() {

        const { solvingStrategy } = this.state;
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
                <FormHelperText>Some important helper text</FormHelperText>
            </FormControl>
            <ButtonContainer>
                <Button variant="contained" color="primary">
                    Query
                </Button>
            </ButtonContainer>
        </QueryInputContainer>
    }
}