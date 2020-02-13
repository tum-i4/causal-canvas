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
    margin-bottom: 5px;
`

export const WelcomePage: React.SFC<any> = () => {
    return <WelcomePageContainer>
        <WelcomePageHeader>Welcome to the Canvas</WelcomePageHeader>
        <WelcomePageText>
            No Causal Model is open:
        </WelcomePageText>
        <WelcomePageText>
            Use File menu to create a new model (ctrl+N) or to import one.
        </WelcomePageText>
    </WelcomePageContainer>
}


