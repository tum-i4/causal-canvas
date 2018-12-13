import React from 'react';
import { INode } from '../../types/GraphTypes';
import styled from './../../style/theme/styled-components';


const FormularInputWrapper = styled.div`
    background-color: ${props => props.theme.colors.primary};
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 80px;
    width: 90%;
`

interface IFormulaInputProps {
    node: INode;
    applyNodeChanges: (updatedNode: INode) => void;
}

interface IFormulaInputState {
    formulaInput: string;
}

export class FormulaInput extends React.Component<IFormulaInputProps, IFormulaInputState>{

    private textInput = React.createRef<HTMLInputElement>();

    constructor(props: IFormulaInputProps) {
        super(props);

        this.state = {
            formulaInput: props.node.formula
        }
    }

    componentDidMount() {
        if (this.textInput.current === null) {
            return;
        }
        this.textInput.current.focus();
    }

    inputChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            formulaInput: ev.target.value
        })
    }

    applyNewFormula = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') {
            this.props.applyNodeChanges({
                ...this.props.node,
                formula: this.state.formulaInput
            })
        }
    }

    render() {

        const { formulaInput } = this.state;

        return <FormularInputWrapper>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <input
                    ref={this.textInput}
                    type='text'
                    value={formulaInput}
                    style={{ width: '90%', height: '50%', textAlign: 'center' }}
                    onChange={this.inputChanged}
                    onKeyUp={this.applyNewFormula}
                />
            </div>
        </FormularInputWrapper>
    }
}