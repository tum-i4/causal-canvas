import React, { Component } from 'react';
import styled from './../../style/theme/styled-components';

const VariableConainer = styled.div`
    display: inline-block;
    margin: 0 3px;
`

const VariableLabel = styled.div`
    display: inline-block;
`

const VariableInputField = styled.input`
    display: inline-block;
    width: ${props => String(props.value).length * 8}px;
    min-width: 20px;
    text-align:center;
    padding: 2px;
`



export interface IVariableInputState {
    editMode: boolean;
    varTitle: string;
}

export interface IVariableInputProps {
    title: string;
    editMode?: boolean;
    onUpdate: (title: string) => void
}

export class VariableInput extends Component<IVariableInputProps, IVariableInputState>  {

    constructor(props: IVariableInputProps) {
        super(props);

        this.state = {
            editMode: props.editMode || false,
            varTitle: props.title
        }
    }

    onChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            varTitle: event.target.value
        })
    }

    toggelEditMode = () => {
        this.setState({
            ...this.state,
            editMode: !this.state.editMode
        })
    }

    onBlur = () => {
        this.props.onUpdate(this.state.varTitle);
        if (!this.props.editMode) {
            this.toggelEditMode();
        } else {
            this.setState({
                ...this.state,
                varTitle: ''
            })
        }
    }

    onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.onBlur();
        }
    }

    public render() {

        const { editMode, varTitle } = this.state;

        let renderVar: any = null;

        if (editMode) {
            renderVar = <VariableInputField
                autoFocus={!this.props.editMode}
                value={varTitle}
                onChange={this.onChanged}
                onBlur={this.onBlur}
                onKeyUp={this.onKeyUp}
            />
        } else {
            renderVar = <VariableLabel
                onClick={this.toggelEditMode}
            >{varTitle}</VariableLabel>
        }

        return <VariableConainer>{renderVar}</VariableConainer>;
    }
}