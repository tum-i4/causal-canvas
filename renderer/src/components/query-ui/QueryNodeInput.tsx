import * as React from 'react';
import styled from '../../style/theme/styled-components';
import { Scrollbars } from 'react-custom-scrollbars';

const FormulaRelativContainer = styled.div`
    position: relative;
`

const CauseSearchInput = styled.input`
    width: 100%;
    height: 40px;
    text-align: left;
    font-size: 20px;
    border: solid 1px ${props => props.theme.colors.primary};
    outline: none;
    &:focus{
        outline: none;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
    }
    border-radius: 3px;
`

const NodeSuggestionsContainer = styled.div`
    position: absolute;
    top: 40px;
    width: 100%;
    height: 100px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    border: 1px solid ${props => props.theme.colors.primary};
    border-top: 0;
    z-index:100;
`

const NodeSuggestionsItem = styled.div<{ selected: boolean }>`
    padding: 4px;
    background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.background}
    cursor: pointer;
    &:hover{
        background-color: ${props => props.theme.colors.primary};
    }
`

export interface IQueryNodeInputState {
    idx: number;
    isFocused: boolean;
    suggestions: string[];
}

export interface IQueryNodeInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    suggsestions: string[];
}

export class QueryNodeInput extends React.Component<IQueryNodeInputProps, IQueryNodeInputState>{

    private inputRef = React.createRef<HTMLInputElement>();
    private wrapperRef = React.createRef<HTMLDivElement>();

    constructor(props: IQueryNodeInputProps) {
        super(props);

        this.state = {
            isFocused: false,
            idx: -1,
            suggestions: this.props.suggsestions.filter(s => s.startsWith(props.value))
        }
    }

    componentDidUpdate(prevProps: IQueryNodeInputProps) {
        if (prevProps.value !== this.props.value) {
            this.setState({
                ...this.state,
                suggestions: this.props.suggsestions.filter(s => s.startsWith(this.props.value))
            })
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.clickOutside);
    }
    componentWillUnmount() {
        document.addEventListener('mousedown', this.clickOutside);
    }

    private clickOutside = (event) => {
        if (this.wrapperRef.current === null) {
            return;
        }
        if (this.wrapperRef.current.contains(event.target)) {
            return;
        }
        this.setState({ isFocused: false });
    }


    private onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {

        const { idx, suggestions } = this.state;
        if (event.keyCode === 13 && idx === -1) {
            this.props.onSubmit();
        }

        if (event.keyCode === 13 && idx !== -1) {
            this.props.onChange(suggestions[idx]);
            this.setState({
                idx: -1,
                isFocused: false
            })
        }

        if (event.keyCode === 38) {
            //event.preventDefault();
            this.setState({
                idx: idx <= 0 ? suggestions.length - 1 : (idx - 1)
            })
        }
        if (event.keyCode === 40) {
            //event.preventDefault();
            this.setState({
                idx: (idx + 1) % suggestions.length
            })
        }
    };

    private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const newValue = event.target.value;
        this.props.onChange(newValue);

    };

    private onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            isFocused: true
        })
    }

    private onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 40 || event.keyCode === 38) {
            event.preventDefault();
        }
    }

    public render() {

        const { value } = this.props;
        const { isFocused, idx, suggestions } = this.state;

        return <FormulaRelativContainer ref={this.wrapperRef}>
            <CauseSearchInput
                ref={this.inputRef}
                value={value}
                onChange={this.onChange}
                onKeyUp={this.onKeyUp}
                onFocus={this.onFocus}
                onKeyDown={this.onKeyDown}
            />
            {
                isFocused && suggestions.length > 0
                    ? <NodeSuggestionsContainer>
                        <Scrollbars style={{ width: '100%', height: '100%' }}>
                            {
                                suggestions.map((s, i) => (
                                    <NodeSuggestionsItem
                                        key={i}
                                        selected={i === idx}
                                        onClick={() => { this.setState({ isFocused: false }); this.props.onChange(s); }}
                                    >
                                        {s}
                                    </NodeSuggestionsItem>
                                ))
                            }
                        </Scrollbars>
                    </NodeSuggestionsContainer>
                    : null
            }

        </FormulaRelativContainer>
    }
}