import React from 'react';
import styled from './../../style/theme/styled-components';

const SuggestionContainer = styled.div`
    border: 1px solid black;
    padding: 4px;
    position: absolute;
`

const SuggestionItem = styled.div<{ selected: boolean }>`
    background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.background}
`

export interface ISuggestionBox {
    suggestions: string[];
    selectedIdx: number;
    position: number | null;
}

export const SuggestionBox: React.SFC<ISuggestionBox> = ({ suggestions, selectedIdx, position }) => {

    if (position === null || suggestions.length === 0) {
        return null;
    }

    return <SuggestionContainer
        style={{
            left: position
        }}
    >
        {
            suggestions.map((suggestion, idx) =>
                <SuggestionItem
                    selected={idx === selectedIdx}
                    key={`suggestion-${idx}`}
                >
                    {suggestion}
                </SuggestionItem>
            )
        }
    </SuggestionContainer>;
}