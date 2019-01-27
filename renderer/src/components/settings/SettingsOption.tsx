import styled from "../../style/theme/styled-components";
import * as React from 'react';

const SettingsOptionContainer = styled.div`
    display: flex;
    padding-left: 10px;
`

const SettingsOptionName = styled.div`

`

const SettingsOptionValue = styled.input`
    width: 200px;
    height: 20px;
    text-align: left;
    font-size: 13px;
    border: solid 1px ${props => props.theme.colors.primary};
    outline: none;
    &:focus{
        outline: none;
    }
    border-radius: 3px;
    margin-right: 20px;
    margin-left: auto;
`

export interface ISettingsOptionProps {
    name: string;
    value: string | number;
    onUpdate: (key: string, value: string | number) => void;
    id: string;
}

export interface ISettingsOptionState {
    value: string | number;
}

export class SettingsOption extends React.Component<ISettingsOptionProps, ISettingsOptionState>{

    constructor(props: ISettingsOptionProps) {
        super(props);

        this.state = {
            value: props.value
        }
    }

    componentDidUpdate(lastProps: ISettingsOptionProps) {
        if (lastProps.value !== this.props.value) {
            this.setState({
                ...this.state,
                value: this.props.value
            })
        }
    }

    private onSearchInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            value: event.target.value
        })
    }

    private updateParrent = () => {
        this.props.onUpdate(this.props.id, this.state.value);
    }

    private onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            this.updateParrent();
        }
    }

    public render() {

        const { name } = this.props;
        const { value } = this.state;

        return <SettingsOptionContainer>
            <SettingsOptionName>{name}</SettingsOptionName>
            <SettingsOptionValue
                onChange={this.onSearchInputChanged}
                value={value}
                onBlur={this.updateParrent}
                onKeyUp={this.onKeyUp}
            />
        </SettingsOptionContainer>
    }
}