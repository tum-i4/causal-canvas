import * as React from 'react';
import { INode } from '../../types/GraphTypes';

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
            <div style={{ backgroundColor: 'grey', position: 'fixed', top: '50%', right: 0, transform: 'translateY(-50%)', height: '200px', width: '200px' }}>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    {
                        !editTitle
                            ? <label onClick={() => this.setState({ ...this.state, editTitle: true })}>{title}</label>
                            : <input style={{ textAlign: 'center' }} type='text' value={title} onChange={this.onTitleChange} onKeyUp={this.applyNewName} />
                    }
                </div>
                <label onClick={this.toggelNodeValue}>value: {String(this.props.node.value)}</label>
            </div>
        )
    }
}