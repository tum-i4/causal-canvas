import * as React from 'react';
import styled from '../style/theme/styled-components';

const WelcomePageContainer = styled.div`
    height: 100%;
    width: 100%;
    background-color: ${props => props.theme.colors.background};
`

const WelcomePageHeader = styled.div`
    font-size: 50px;
    text-align: center;
    margin-top: 100px;
    margin-bottom: 50px;
`
const WelcomePageText = styled.div`
    font-size: 23px;
    text-align: center;
    color: ${props => props.theme.colors.primary};
`

export const WelcomePage: React.SFC<any> = () => {
    return <WelcomePageContainer>
        <WelcomePageHeader>Causal Canvas</WelcomePageHeader>
        <WelcomePageText>
            no Causal Model open
        </WelcomePageText>
        <WelcomePageText>
            create a new or import one
        </WelcomePageText>
    </WelcomePageContainer>
}


