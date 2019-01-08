import React, { Component } from 'react';
import styled from './../../style/theme/styled-components';
import { VariableInput } from './VariableInput';
import { OperatorInput } from './OperatorInput';

const FormulaContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 80px;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid black;
`

export interface IFormulaInputState {
    variables: string[];
}

export interface IFormulaInputProps {
    formula: string;
}

export class NewFormulaInput extends Component<IFormulaInputProps, IFormulaInputState> {

    constructor(props: IFormulaInputProps) {
        super(props);

        this.state = {
            variables: this.prepareFormula(props.formula)
        }
    }

    prepareFormula = (formula: string): string[] => {
        return formula.trim().replace(/&/g, ' & ').replace(/\|/g, ' | ').split(' ')
    }

    onVariableUpdate = (idx: number, title: string) => {
        this.setState({
            ...this.state,
            variables: this.state.variables.map((v, _idx) => _idx === idx ? title : v).filter(v => v !== '')
        })
    }

    addVariable = (idx: number, title: string) => {
        if (title === '') {
            return;
        }
        const variables = this.state.variables;
        console.log({ title, variables });
        if (idx === 0) {
            variables.splice(idx, 0, title, '|');
        } else {
            variables.splice(idx, 0, '|', title);
        }
        this.setState({
            ...this.state,
            variables
        })
    }

    public render() {

        const { variables } = this.state;
        console.log({ variables });
        const isLogicOperator = (title: string) => /&|\|/.test(title);
        const variableInputs = variables.map(
            (title, idx) =>
                isLogicOperator(title)
                    ? <OperatorInput
                        value={title}
                        onChange={(_newValue: string) => this.onVariableUpdate(idx, _newValue)}
                    />
                    : <VariableInput
                        key={`${title}-${idx}`}
                        onUpdate={(_title: string) => this.onVariableUpdate(idx, _title)}
                        title={title}
                    />
        )

        console.log({ variableInputs });

        return <FormulaContainer>
            <VariableInput
                title={''}
                onUpdate={(title) => this.addVariable(0, title)}
                editMode={true}
            />
            {
                variableInputs
            }
            <VariableInput
                title={''}
                onUpdate={(title) => this.addVariable(variables.length, title)}
                editMode={true}
            />
        </FormulaContainer>;
    }

}