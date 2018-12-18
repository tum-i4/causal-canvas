import React, { Component, createRef } from 'react';
import styled from '../../style/theme/styled-components';
import { cmdEvent } from './CmdEvent';


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
}

export class Cmd extends Component<ICmdProps, ICmdState> {

    private inputRef = createRef<HTMLInputElement>();
    private commands = [
        'goto',
        'highlight',
        'reset',
    ]

    private usedArrow = false;

    constructor(props: ICmdProps) {
        super(props);

        this.state = {
            open: false,
            cmdValue: '',
            selected: -1
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
            if (this.usedArrow) {
                this.usedArrow = false;
                this.setState({
                    cmdValue: this.commands[this.state.selected]
                })
                return;
            }
            this.setState({
                open: false,
                cmdValue: '',
                selected: -1
            })
            this.executeCommand();
        }
        if (event.keyCode === 38) {
            this.usedArrow = true;
            this.setState({
                selected: this.state.selected <= 0 ? this.commands.length - 1 : (this.state.selected - 1)
            })
        }
        if (event.keyCode === 40) {
            this.usedArrow = true;
            this.setState({
                selected: (this.state.selected + 1) % this.commands.length
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
                        this.commands.map((c, idx) => (
                            <CmdListItem
                                key={idx}
                                selected={selected === idx}
                            >
                                {c}
                            </CmdListItem>
                        ))
                    }
                </CmdList>
            </CmdContainer>
        )
    }
}