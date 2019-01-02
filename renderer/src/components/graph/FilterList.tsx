import * as React from 'react';
import styled from './../../style/theme/styled-components';

const FilterListContainer = styled.div`
    position: fixed;
    top: 30px;
    left: 30px;
`

const FilterListItem = styled.div`
    margin: 10px;
    background-color: ${props => props.theme.colors.primary}
    padding: 6px;
    min-width: 100px;
    border-radius: 5px;
`

const FilterListItemRemove = styled.div`
    margin-left: 7px;
    display: inline-block;
    cursor: pointer;
    float: right;
`

export interface IFilter {
    id: string;
    source: string;
    applyTo: string[];
}

export interface IFilterListProps {
    filters: IFilter[];
    removeFilter: (id: string) => void;
}

export const FilterList: React.SFC<IFilterListProps> = ({ filters, removeFilter }) => {
    return <FilterListContainer>
        {
            filters.map(
                filter => <FilterListItem key={filter.id}>
                    {filter.source}
                    <FilterListItemRemove onClick={() => removeFilter(filter.id)}>×</FilterListItemRemove>
                </FilterListItem>)
        }
    </FilterListContainer>;
}