import React from 'react';
import styled from './../../style/theme/styled-components';


const CauseListItemContainer = styled.div`
    display: flex;
    padding: 3px;
`

const CauseListItemName = styled.div`
    flex: 1;
`

const CauseListItemValue = styled.div`
    width: 50px;
    cursor: pointer;
`

const CauseListItemDelete = styled.div`
    width: 25px;
    cursor: pointer;
`

export interface ICauseListItemProps {
    name: string;
    value: boolean;
    remove?: (idx: number) => void;
    toggel: (idx: number) => void;
    idx: number;
}
export const CauseListItem: React.SFC<ICauseListItemProps> = ({ value, idx, name, remove, toggel }) => {
    return <CauseListItemContainer>
        <CauseListItemName>
            {name}
        </CauseListItemName>
        <CauseListItemValue
            onClick={() => toggel(idx)}
        >
            {String(value)}
        </CauseListItemValue>
        {
            remove !== undefined
                ? <CauseListItemDelete
                    onClick={() => remove(idx)}
                >
                    ×
                </CauseListItemDelete>
                : null
        }
    </CauseListItemContainer>
}