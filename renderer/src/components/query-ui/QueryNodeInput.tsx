import * as React from 'react';
import styled from '../../style/theme/styled-components';


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

export interface IQueryNodeInputState {
    idx: number;
    suggestions: string[];
}

export interface IQueryNodeInputProps {
    value: string;
    onChange: (value: string) => void;
}
export class QueryNodeInput extends React.Component<IQueryNodeInputProps, IQueryNodeInputState>{


    constructor(props: IQueryNodeInputProps) {
        super(props);
    }

    private onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {

    };

    private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const newValue = event.target.value;
        this.props.onChange(newValue);


    };

    public render() {

        const { value } = this.props;

        return <React.Fragment>
            <CauseSearchInput
                value={value}
                onChange={this.onChange}
                onKeyUp={this.onKeyUp}
            />
        </React.Fragment>
    }
}