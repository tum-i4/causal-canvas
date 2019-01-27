import React from "react";
import { ITheme } from "../../style/theme/Theme";
import styled from "../../style/theme/styled-components";
import { Scrollbars } from 'react-custom-scrollbars';
import { SettingsOption } from "./SettingsOption";
import { SettingsHead } from "./SettingsHead";
import _ from "lodash";

const SettingsWrapper = styled.div`
    height: 100%;
    width: 700px;
    margin: auto;
    padding: 20px 10px 10px 20px;
    background-color: ${props => props.theme.colors.background};
`

const SettingsHeader = styled.div`
    margin-bottom: 20px;
`

const SettingsActions = styled.div`

`

const SettingsTitle = styled.div`
    font-size: 40px;
    margin-bottom: 0px;
    display: inline-block;
`

const SettingsBtn = styled.div<{ first?: boolean }>`
    cursor: pointer;
    display: inline-block;
    margin-left: ${props => props.first ? '0' : '15'}px;
    margin-bottom: 10px;
`

const SettingsSearchInput = styled.input`
    width: 100%;
    height: 30px;
    text-align: left;
    font-size: 18px;
    border: solid 1px ${props => props.theme.colors.primary};
    outline: none;
    &:focus{
        outline: none;
    }
    border-radius: 3px;
`

export interface ISettingsPorps {
    style: ITheme;
    general: ISettings;
    onUpdate: (key: string, obj: any) => void;
    close: () => void;
    resetToDefaultStyle: () => void;
}

export interface ISettingsState {
    searchValue: string;
    selected: string;
}

interface ISettings {
    [key: string]: string | number | ISettings;
}

export class Settings extends React.Component<ISettingsPorps, ISettingsState> {

    constructor(props: ISettingsPorps) {
        super(props);

        this.state = {
            searchValue: ''

        }
    }

    private onSearchInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            searchValue: event.target.value
        })
    }

    private updateValue = (key: string, value: string | number) => {
        const newObj = { ...this.props.style };
        _.update(newObj, key, () => value);
        this.props.onUpdate('style', newObj);
    }

    private makeSettingsFromObj = (obj: ISettings, keyPrefix: string = '') => {
        let elements: any[] = [];
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === "string" || typeof value === "number") {
                if ((keyPrefix + key).toLowerCase().includes(this.state.searchValue)) {
                    elements.push(
                        <SettingsOption key={keyPrefix + key} id={keyPrefix + key} name={key} value={value} onUpdate={this.updateValue} />
                    );
                }
            } else {
                const subSettings = this.makeSettingsFromObj(value, keyPrefix + key + ".");
                if (subSettings.length > 0) {
                    elements.push(<SettingsHead key={keyPrefix + key} name={keyPrefix + key} />);
                    elements = elements.concat(subSettings)
                }
            }
        }

        return elements;
    }

    private saveSettings = () => {
        window.localStorage.setItem('style', JSON.stringify(this.props.style));
    }

    public render() {

        const { searchValue } = this.state;
        const { style, close, resetToDefaultStyle } = this.props;

        return <SettingsWrapper>
            <SettingsHeader>
                <SettingsTitle>Style</SettingsTitle>
                <SettingsActions>
                    <SettingsBtn first={true} onClick={close}>Close</SettingsBtn>
                    <SettingsBtn onClick={this.saveSettings}>Save</SettingsBtn>
                    <SettingsBtn onClick={resetToDefaultStyle}>reset</SettingsBtn>
                </SettingsActions>
                <SettingsSearchInput
                    onChange={this.onSearchInputChanged}
                    value={searchValue}
                />
            </SettingsHeader>
            <Scrollbars style={{ width: '100%', height: 'calc(100% - 120px)' }}>
                <SettingsTitle>Style</SettingsTitle>
                {
                    this.makeSettingsFromObj(style as any, '')
                }
            </Scrollbars>
        </SettingsWrapper>
    }
}