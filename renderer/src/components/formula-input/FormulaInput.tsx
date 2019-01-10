import React, { Component, createRef } from 'react';
import styled from './../../style/theme/styled-components';
import { SuggestionBox } from './SuggestionBox';

const FormulaContainer = styled.div`
    position: fixed;
    bottom: 50px;
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
    //word-spacing: 5px;
    font-size: 20px;
    border: solid 2px ${props => props.theme.colors.primary};
    outline: none;
    &:focus{
        outline: none;
    }
    border-radius: 5px;
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
}

export interface IFormulaInputProps {
    formula: string;
}

const test = [
    'yolonese', 'test123', 'abcd', 'aabcd', 'aaabcd', 'aaaabcd'
]

export class NewFormulaInput extends Component<IFormulaInputProps, IFormulaInputState> {

    private inputRef = createRef<HTMLInputElement>();
    constructor(props: IFormulaInputProps) {
        super(props);

        this.state = {
            formula: props.formula.replace(/&/g, ' & ').replace(/\|/g, ' | '),
            cursorPos: 0,
            selectedIdx: -1,
            suggestionList: test
        }
    }

    componentDidMount = () => {
        this.setState(this.state)
    }

    onFormulaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            formula: event.target.value
        })
    }

    onSelect = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const cursorPos = event.currentTarget.selectionStart || 0;
        const { formula } = this.state;
        const currentWord = this.getWordAtPos(cursorPos, formula) || '';
        console.log(currentWord);
        this.setState({
            ...this.state,
            cursorPos,
            suggestionList: test.filter(suggestion => suggestion.startsWith(currentWord)),
            selectedIdx: -1
        });
    };

    private calcSuggestionBoxPos = () => {

        const currentRef = this.inputRef.current;
        const { cursorPos, formula } = this.state;
        if (currentRef === null) {
            return null;
        }

        return currentRef.offsetLeft + currentRef.offsetWidth / 2 + (cursorPos - formula.length / 2) * 9.53;
    }

    private getWordAtPos = (cursorPos: number, formula: string) => {

        let sum = 0;
        let split = formula.split(" ");
        console.log({ split, cursorPos });
        if (cursorPos === formula.length) {
            return split[split.length - 1];
        }
        // if (formula.charAt(cursorPos) === " ") {
        //     return "";
        // }
        for (const word of split) {
            sum += word.length;
            if (sum >= cursorPos) {
                return word;
            }
        }
    };

    private onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {

        const { selectedIdx, suggestionList, formula, cursorPos } = this.state;
        if (event.keyCode === 13 && selectedIdx !== -1) {

            const replaceWordAtPos = () => {
                let split = formula.split(' ');

                let idx = 0;

                if (cursorPos === formula.length) {
                    idx = split.length - 1;
                } else {
                    let sum = 0;
                    for (let i = 0; i < split.length; i++) {
                        sum += split[i].length;
                        if (sum >= cursorPos) {
                            idx = i;
                            break;
                        }
                    }
                }

                split[idx] = suggestionList[selectedIdx];
                return split.join(' ');
            }

            this.setState({
                ...this.state,
                selectedIdx: -1,
                formula: replaceWordAtPos()
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

    public render() {

        const { formula, selectedIdx, suggestionList } = this.state;

        return <FormulaContainer>
            <FormulaRelativContainer>
                <FormularInputInput
                    autoFocus
                    ref={this.inputRef}
                    type={'text'}
                    value={formula}
                    onChange={this.onFormulaChange}
                    onSelect={this.onSelect}
                    onKeyUp={this.onKeyUp}
                    onKeyDown={this.onKeyDown}
                />
                <SuggestionBox
                    position={this.calcSuggestionBoxPos()}
                    suggestions={suggestionList}
                    selectedIdx={selectedIdx}
                />
            </FormulaRelativContainer>
        </FormulaContainer>;
    }

}