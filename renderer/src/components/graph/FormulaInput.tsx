import React from 'react';
import { INode } from '../../types/GraphTypes';
import styled from './../../style/theme/styled-components';


//background-color: ${props => props.theme.colors.primary};
const FormularInputWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 80px;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const FormularInputInput = styled.input`
    width: 90%;
    height: 50%;
    text-align: center;
    word-spacing: 5px;
    font-size: 20px;
    border: solid 2px ${props => props.theme.colors.primary};
    outline: none;
    &:focus{
        outline: none;
    }
    border-radius: 5px;
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
        console.log(ev.target.selectionStart)
        this.setState({
            formulaInput: ev.target.value.replace(/\s/g, '')
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

        const spacedText = formulaInput.replace(/&/g, ' & ').replace(/\|/g, ' | ')
        return <FormularInputWrapper>
            <FormularInputInput
                ref={this.textInput}
                type='text'
                value={spacedText}
                onChange={this.inputChanged}
                onKeyUp={this.applyNewFormula}
            />
        </FormularInputWrapper>
    }
}