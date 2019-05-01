import React from "react";
import { ITheme } from "../../style/theme/Theme";
import styled from "../../style/theme/styled-components";
import { Scrollbars } from 'react-custom-scrollbars';
import { SettingsOption } from "./SettingsOption";
import { SettingsHead } from "./SettingsHead";
import _ from "lodash";
import { BasicTheme } from "../../style/theme/themes/basic.theme";
import { GeneralSettingsDefault } from "./GeneralSettings";

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

const SettingsTitle = styled.div<{ selected: boolean }>`
    font-size: ${props => props.selected ? 40 : 30}px;
    margin-bottom: 0px;
    display: inline-block;
    margin-right: 15px;
    cursor: pointer;
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
enum SettingsType {
    Style = 'style',
    General = 'general'
}

export interface ISettingsPorps {
    style: ITheme;
    general: ISettings;
    onUpdate: (key: string, obj: any) => void;
    close: () => void;
}

export interface ISettingsState {
    searchValue: string;
    selected: SettingsType;
    setting: ISettings;
}

interface ISettings {
    [key: string]: string | number | ISettings;
}

export class Settings extends React.Component<ISettingsPorps, ISettingsState> {

    constructor(props: ISettingsPorps) {
        super(props);

        this.state = {
            searchValue: '',
            selected: SettingsType.Style,
            setting: _.cloneDeep(props.style) as any
        }
    }


    componentDidUpdate(lastProps: ISettingsPorps) {
        if (this.state.selected === SettingsType.Style) {
            if (!_.isEqual(lastProps.style, this.props.style)) {
                return this.setState({
                    ...this.state,
                    setting: _.cloneDeep(this.props.style as any)
                })
            }
        }

        if (this.state.selected === SettingsType.General) {
            if (!_.isEqual(lastProps.general, this.props.general)) {
                return this.setState({
                    ...this.state,
                    setting: _.cloneDeep(this.props.general as any)
                })
            }
        }
    }
    private onSearchInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            searchValue: event.target.value
        })
    }

    private updateValue = (key: string, value: string | number) => {
        const newObj = _.cloneDeep(this.state.setting);
        _.update(newObj, key, () => value);
        this.props.onUpdate(this.state.selected, newObj);
    }

    private resetToDefault = () => {
        if (this.state.selected === SettingsType.Style) {
            return this.props.onUpdate(this.state.selected, _.cloneDeep(BasicTheme));
        }
        if (this.state.selected === SettingsType.General) {
            return this.props.onUpdate(this.state.selected, _.cloneDeep(GeneralSettingsDefault));
        }
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
        window.localStorage.setItem(this.state.selected, JSON.stringify(this.state.setting));
    }

    private selectSetting = (setting: any, selected: SettingsType) => {
        this.setState({
            ...this.state,
            setting: _.cloneDeep(setting),
            selected
        })
    }

    public render() {

        const { searchValue, setting, selected } = this.state;
        const { close, style, general } = this.props;

        return <SettingsWrapper>
            <SettingsHeader>
                <SettingsTitle
                    selected={selected === SettingsType.Style}
                    onClick={() => this.selectSetting(style, SettingsType.Style)}
                >
                    Style
                </SettingsTitle>
                <SettingsTitle
                    selected={selected === SettingsType.General}
                    onClick={() => this.selectSetting(general, SettingsType.General)}
                >
                    General
                </SettingsTitle>
                <SettingsActions>
                    <SettingsBtn first={true} onClick={close}>Close</SettingsBtn>
                    <SettingsBtn onClick={this.saveSettings}>Save</SettingsBtn>
                    <SettingsBtn onClick={this.resetToDefault}>reset</SettingsBtn>
                </SettingsActions>
                <SettingsSearchInput
                    onChange={this.onSearchInputChanged}
                    value={searchValue}
                />
            </SettingsHeader>
            <Scrollbars style={{ width: '100%', height: 'calc(100% - 140px)' }}>
                {
                    this.makeSettingsFromObj(setting, '')
                }
            </Scrollbars>
        </SettingsWrapper>
    }
}