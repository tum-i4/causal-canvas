import * as React from 'react';
import { INode } from '../../types/GraphTypes';
import styled from '../../style/theme/styled-components';
import { NewFormulaInput } from '../formula-input/FormulaInput';
import _ from 'lodash';

const InfoPannelContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: ${props => props.theme.colors.background};
    border-bottom: 1px solid ${props => props.theme.colors.primary};
    padding-bottom: 10px;
`

const TitleWrapper = styled.div`
    text-align: center;
    margin-bottom: 0px;
    width: 100%;
    font-size: 25px;
    margin-top: 15px;
`

const TitleInput = styled.input`
    width: 300px;
    height: 40px;
    text-align: center;
    font-size: 20px;
    border: solid 1px ${props => props.theme.colors.primary};
    outline: none;
    &:focus{
        outline: none;
    }
    border-radius: 3px;
    margin-left: 50%;
    transform: translate(-50%);
    margin-top: 15px;
`

const FormulaContainer = styled.div`
    height: 40px;
    width: 90%;
    margin-top: 6px;
    margin-left: 50%;
    transform: translate(-50%);
`

const TitleSpan = styled.span<{ isNotClick?: boolean }>`
    cursor: ${props => props.isNotClick ? 'auto' : 'pointer'};
    color: ${props => props.isNotClick ? props.theme.colors.error : props.theme.colors.primary};
`

const NodeTypeWrapper = styled.div`
    text-align: center;
    color: ${props => props.theme.colors.primary};
    font-size: 10px;
`

export interface IInfoPanelProps {
    selectedNodes: INode[];
    nodes: INode[];
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
            title: '',
            editTitle: false
        }
    }

    componentDidUpdate(prevProps: IInfoPanelProps) {
        if (!_.isEqual(prevProps.selectedNodes, this.props.selectedNodes)) {
            this.setState({
                ...this.state,
                editTitle: false
            })
        }
    }

    onTitleClick = (ev: React.MouseEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            editTitle: true,
            title: this.props.selectedNodes[0].title
        })
    }

    onTitleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            title: ev.target.value
        })
    }

    onTitleInputBlur = () => {
        this.props.applyNodeChanges({
            ...this.props.selectedNodes[0],
            title: this.state.title
        })

        this.setState({
            ...this.state,
            editTitle: false
        })
    }

    onKeyUp = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') {
            this.onTitleInputBlur();
        }
    }

    toggelNodeType = () => {
        let node = this.props.selectedNodes[0];
        console.log('yolo');
        if (node.isExogenousVariable) {
            this.props.applyNodeChanges({
                ...node,
                formula: '',
                isExogenousVariable: false
            })
        }
        else if (!node.isExogenousVariable && node.formula === '') {
            this.props.applyNodeChanges({
                ...node,
                isExogenousVariable: true
            })
        }
    }

    render() {

        const { selectedNodes, nodes } = this.props;
        const { editTitle, title } = this.state;

        if (selectedNodes.length === 0) {
            return null;
        }

        const node = selectedNodes[0];
        return (
            <InfoPannelContainer>
                {
                    editTitle
                        ? <TitleInput
                            onChange={this.onTitleChange}
                            onKeyUp={this.onKeyUp}
                            value={title}
                            onBlur={this.onTitleInputBlur}
                            autoFocus
                        />
                        : <TitleWrapper>
                            <TitleSpan onClick={this.onTitleClick}>{node.title}</TitleSpan>
                        </TitleWrapper>
                }
                <NodeTypeWrapper>
                    <TitleSpan
                        isNotClick={!(!node.isExogenousVariable && node.formula === '' || node.isExogenousVariable)}
                        onClick={!node.isExogenousVariable && node.formula === '' || node.isExogenousVariable ? this.toggelNodeType : undefined}
                    >
                        change to {node.isExogenousVariable ? 'Endogenous' : 'Exogenous'}
                    </TitleSpan>
                </NodeTypeWrapper>
                <FormulaContainer>
                    <NewFormulaInput
                        nodes={nodes}
                        formula={node.formula}
                        onChange={
                            (formula => this.props.applyNodeChanges({ ...node, formula }))
                        }
                    />
                </FormulaContainer>
            </InfoPannelContainer>
        )
    }
}