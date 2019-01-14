import React from 'react';
import styled from './../../style/theme/styled-components';

const SuggestionContainer = styled.div`
    border: 1px solid ${props => props.theme.colors.primary};
    border-top: 0;
    position: absolute;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    z-index: 100;
    background-color: ${props => props.theme.colors.background}
`

const SuggestionItem = styled.div<{ selected: boolean }>`
    padding: 4px;
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