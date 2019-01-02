import React, { Component, createRef } from 'react';
import styled from '../../style/theme/styled-components';
import { cmdEvent } from './CmdEvent';
import { INode } from '../../types/GraphTypes';


const CmdContainer = styled.div`
    position: fixed;
    top: 0;
    left: 50%
    transform: translateX(-50%);
    width: 450px;
    height: 44px;
    background-color: ${props => props.theme.colors.primary};
    display: flex;
    justify-content: center;
    align-items: center;
`

const CmdInput = styled.input`
    padding: 3px;
    padding-left: 10px;
    width: 93%;
    border: solid 1px ${props => props.theme.colors.secondary};
    outline: none;
    border-radius: 3px;
    &:focus{
        outline: none;
    }
`

const CmdList = styled.div`
    position: fixed;
    top: 42px;
    left: 50%
    transform: translateX(-50%);
    width: 450px;
    max-height: 200px;
    background-color: ${props => props.theme.colors.primary};
    color: #ffffff;
    overflow: hidden;
`

const CmdListItem = styled.div<{ selected: boolean }>`
    padding: 2px;
    padding-left: 10px;
    font-size: 12px;
    background-color: ${props => props.selected ? '#34495e' : props.theme.colors.primary}
`

interface ICmdState {
    open: boolean;
    cmdValue: string;
    selected: number;
}

interface ICmdProps {
    nodes: string[];
}

export class Cmd extends Component<ICmdProps, ICmdState> {

    private inputRef = createRef<HTMLInputElement>();
    private commands = [
        'goto',
        'highlight',
        'reset',
        'set'
    ]

    private list: string[] = this.commands;

    constructor(props: ICmdProps) {
        super(props);

        this.state = {
            open: false,
            cmdValue: '',
            selected: -1,
        }
    }

    componentDidMount() {
        window.addEventListener('keyup', this.keyUpHandlerWindow)
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.keyUpHandlerWindow);
    }

    keyUpHandlerWindow = (event: KeyboardEvent) => {
        if (event.shiftKey && event.ctrlKey && event.keyCode === 80) {

            if (!this.state.open) {
                setTimeout(() => {
                    if (this.inputRef.current !== null) {
                        this.inputRef.current.focus();
                    }
                }, 80)
            }

            this.setState({
                open: !this.state.open
            })
        }
    }

    cmdInoutChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            cmdValue: event.target.value
        })
    }

    keyUpHandlerInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            if (this.state.selected !== -1) {
                this.setState({
                    selected: -1,
                    cmdValue: this.state.cmdValue.split(' ').length > 1 ? this.state.cmdValue + this.list[this.state.selected] + " " : this.list[this.state.selected] + " ",
                })
                return;
            }
            this.setState({
                open: false,
                cmdValue: '',
                selected: -1
            })
            this.list = this.commands;
            this.executeCommand();
        }
        if (event.keyCode === 38) {
            this.setState({
                selected: this.state.selected <= 0 ? this.list.length - 1 : (this.state.selected - 1)
            })
        }
        if (event.keyCode === 40) {
            this.setState({
                selected: (this.state.selected + 1) % this.list.length
            })
        }
    }

    executeCommand() {
        const [cmd, ...args] = this.state.cmdValue.split(' ');

        cmdEvent.emit('cmd', {
            type: cmd,
            args: args
        });

    }

    render() {
        const { open, cmdValue, selected } = this.state;

        if (!open) {
            return null;
        }

        const split = cmdValue.split(' ');
        if (split.length > 1) {
            this.list = this.props.nodes;
        }

        return (
            <CmdContainer>
                <CmdInput
                    ref={this.inputRef}
                    onChange={this.cmdInoutChanged}
                    value={cmdValue}
                    onKeyUp={this.keyUpHandlerInput}
                />
                <CmdList>
                    {
                        this.list.map((c, idx) => (
                            c.includes(split[split.length - 1]) || split.length === 1 || split[split.length - 1] === ''
                                ? <CmdListItem
                                    key={idx}
                                    selected={selected === idx}
                                >
                                    {c}
                                </CmdListItem>
                                : null
                        ))
                    }
                </CmdList>
            </CmdContainer>
        )
    }
}