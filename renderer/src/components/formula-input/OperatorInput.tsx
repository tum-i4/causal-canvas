import * as React from 'react';
import styled from './../../style/theme/styled-components';

const OperatorInputContainer = styled.div`
    display: inline-block;
`

export interface IOperatorInput {
    value: string;
    onChange: (newValue: string) => void;
}

export const OperatorInput: React.SFC<IOperatorInput> = ({ value, onChange }) => {

    return <OperatorInputContainer
        onClick={() => value === '&' ? onChange('|') : onChange('&')}
    >
        {value}
    </OperatorInputContainer>
}