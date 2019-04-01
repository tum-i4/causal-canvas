import React, { Component, createRef } from 'react';
import styled from './../../style/theme/styled-components';
import { SuggestionBox } from './SuggestionBox';
import { INode } from '../../types/GraphTypes';
import { makeSuggestionList, replaceWordAtPos, getWordType, WordType } from './makeSuggetions';

const FormularInputInput = styled.input`
    width: 100%;
    height: 100%;
    text-align: center;
    //word-spacing: 5px;
    font-size: 20px;
    border: solid 1px ${props => props.theme.colors.primary};
    outline: none;
    &:focus{
        outline: none;
    }
    border-radius: 3px;
`

const FormulaRelativContainer = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
`

export interface IFormulaInputState {
    formula: string;
    cursorPos: number;
    selectedIdx: number;
    suggestionList: string[];
    isFocused: boolean;
}

export interface IFormulaInputProps {
    formula: string;
    nodes: INode[];
    onChange: (formula: string) => void;
    autoFocus?: boolean;
}

export class NewFormulaInput extends Component<IFormulaInputProps, IFormulaInputState> {

    private inputRef = createRef<HTMLInputElement>();
    constructor(props: IFormulaInputProps) {
        super(props);

        this.state = {
            formula: this.makeTitleFormula(props.formula).replace(/&/g, ' & ').replace(/\|/g, ' | '),
            cursorPos: 0,
            selectedIdx: -1,
            suggestionList: props.nodes.map(n => n.title),
            isFocused: this.props.autoFocus || false
        }
    }

    componentDidMount = () => {
        this.setState(this.state)
    }

    componentDidUpdate = (oldProps: IFormulaInputProps) => {
        if (oldProps.formula !== this.props.formula) {
            this.setState({
                ...this.state,
                formula: this.makeTitleFormula(this.props.formula).replace(/&/g, ' & ').replace(/\|/g, ' | ')
            });
        }
    }

    onFormulaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            formula: event.target.value
        })
    }

    onSelect = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const cursorPos = event.currentTarget.selectionStart || 0;
        this.setState({
            ...this.state,
            cursorPos,
            suggestionList: makeSuggestionList(cursorPos, this.state.formula, this.props.nodes.map(n => n.title)),
            selectedIdx: -1
        });
    };

    private calcSuggestionBoxPos = () => {

        const currentRef = this.inputRef.current;
        const { cursorPos, formula } = this.state;
        if (currentRef === null) {
            return null;
        }

        return currentRef.offsetLeft + currentRef.offsetWidth / 2 + (cursorPos - formula.length / 2) * 9.55;
    }

    private makeIDFormula = () => {
        const { formula } = this.state;
        const splitFormula = formula.split(' ');
        let newFormula = "";
        for (const word of splitFormula) {
            if (getWordType(word) === WordType.Variable) {
                const node = this.props.nodes.find(n => n.title === word.replace('!', ''));
                if (node === undefined) {
                    newFormula += word;
                } else {
                    if (word.startsWith('!')) {
                        newFormula += '!' + node.id;
                    } else {
                        newFormula += node.id;
                    }
                }
            } else {
                newFormula += word;
            }
        }
        return newFormula;
    }

    private makeTitleFormula = (formula: string) => {
        const splitFormula = formula.replace(/&/g, ' & ').replace(/\|/g, ' | ').split(' ');
        let newFormula = ""
        for (const word of splitFormula) {
            console.log(word);
            if (getWordType(word) === WordType.Variable) {
                const node = this.props.nodes.find(n => n.id === word.replace('!', ''));
                if (node === undefined) {
                    newFormula += word;
                } else {
                    if (word.startsWith('!')) {
                        newFormula += '!' + node.title;
                    } else {
                        newFormula += node.title;
                    }
                }
            } else {
                newFormula += word;
            }
        }

        return newFormula;
    }

    private onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {

        const { selectedIdx, suggestionList, formula, cursorPos } = this.state;

        if (event.keyCode === 13 && selectedIdx === -1) {
            this.props.onChange(this.makeIDFormula());
        }
        if (event.keyCode === 13 && selectedIdx !== -1) {
            this.setState({
                ...this.state,
                selectedIdx: -1,
                formula: replaceWordAtPos(cursorPos, formula, suggestionList[selectedIdx])
            })
        }
        if (event.keyCode === 38) {
            //event.preventDefault();
            this.setState({
                selectedIdx: selectedIdx <= 0 ? suggestionList.length - 1 : (selectedIdx - 1)
            })
        }
        if (event.keyCode === 40) {
            //event.preventDefault();
            this.setState({
                selectedIdx: (selectedIdx + 1) % suggestionList.length
            })
        }
    }

    private onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 40 || event.keyCode === 38) {
            event.preventDefault();
        }
    }

    private onFocus = () => {
        this.setState({
            ...this.state,
            isFocused: true
        })
    }

    private onBlur = () => {
        this.setState({
            ...this.state,
            isFocused: false
        })
    }

    public render() {

        const { formula, selectedIdx, suggestionList, isFocused } = this.state;
        const { autoFocus } = this.props;

        return <FormulaRelativContainer>
            <FormularInputInput
                autoFocus={autoFocus || false}
                ref={this.inputRef}
                type={'text'}
                value={formula}
                onChange={this.onFormulaChange}
                onSelect={this.onSelect}
                onKeyUp={this.onKeyUp}
                onKeyDown={this.onKeyDown}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
            />
            {
                isFocused ?
                    <SuggestionBox
                        position={this.calcSuggestionBoxPos()}
                        suggestions={suggestionList}
                        selectedIdx={selectedIdx}
                    /> : null
            }
        </FormulaRelativContainer>
    }

}