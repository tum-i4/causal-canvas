import * as React from 'react';
import { INode } from '../../types/GraphTypes';
import styled from '../../style/theme/styled-components';

const InfoPannelContainer = styled.div`
    background-color: ${props => props.theme.colors.primary};
    padding: 10px;
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    height: 200px;
    width: 200px;
    color: #ffffff;

`

const TitleWrapper = styled.div`
    text-align: center;
    margin-bottom: 10px;
`

const TitleInput = styled.input`

    text-align: center;
    border: solid 1px ${props => props.theme.colors.secondary};
    outline: none;
    &:focus{
        outline: none;
    }
    border-radius: 3px;
`

export interface IInfoPanelProps {
    node: INode;
    applyNodeChanges: (updatedNode: INode) => void;
}

export interface IInfoPanelState {
    title: string;
    editTitle: boolean;
}

export class InfoPanel extends React.Component<IInfoPanelProps, IInfoPanelState>{

    constructor(props: IInfoPanelProps) {
        super(props);

        this.state = {
            title: props.node.title,
            editTitle: false
        }
    }

    onTitleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            title: ev.target.value
        })
    }

    applyNewName = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') {
            this.props.applyNodeChanges({
                ...this.props.node,
                title: this.state.title
            })

            this.setState({
                ...this.state,
                editTitle: false
            })
        }
    }

    toggelNodeValue = () => {
        if (!this.props.node.isExogenousVariable) {
            return;
        }

        this.props.applyNodeChanges({
            ...this.props.node,
            value: !this.props.node.value
        })
    }

    render() {

        const { title, editTitle } = this.state;

        return (
            <InfoPannelContainer>
                <TitleWrapper>
                    {
                        !editTitle
                            ? <label onClick={() => this.setState({ ...this.state, editTitle: true })}>{title}</label>
                            : <TitleInput type='text' value={title} onChange={this.onTitleChange} onKeyUp={this.applyNewName} />
                    }
                </TitleWrapper>
                <label onClick={this.toggelNodeValue}>value: {String(this.props.node.value)}</label>
            </InfoPannelContainer>
        )
    }
}