import styled from "../../style/theme/styled-components";
import * as React from 'react';
import _ from "lodash";

const SettingsHeadContainer = styled.div`
    font-size: 26px;
    padding: 5px 0px;
`

export interface ISettingsHeadProps {
    name: string;
}
export const SettingsHead: React.SFC<ISettingsHeadProps> = ({ name }) => {
    return <SettingsHeadContainer>{_.startCase(name)}</SettingsHeadContainer>
}