import React, { Component, createRef } from 'react';
import styled from '../../style/theme/styled-components';
import { cmdEvent } from './CmdEvent';


const CmdContainer = styled.div`
    position: fixed;
    top: 0;
    left: 50%
    transform: translateX(-50%);
    width: 450px;
    height: 45px;
    background-color: ${props => props.theme.colors.primary};
    display: flex;
    justify-content: center;
    align-items: center;
`

const CmdInput = styled.input`
    width: 90%;
`

interface ICmdState {
    open: boolean;
    cmdValue: string;
}

interface ICmdProps {
}

export class Cmd extends Component<ICmdProps, ICmdState> {

    private inputRef = createRef<HTMLInputElement>();

    constructor(props: ICmdProps) {
        super(props);

        this.state = {
            open: false,
            cmdValue: ''
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
            this.setState({
                open: false
            })

            this.executeCommand();
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
        const { open, cmdValue } = this.state;

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
            </CmdContainer>
        )
    }
}