import React, { Component } from 'react';
import styled from './../../style/theme/styled-components';

export interface IAddVarState {

}

export interface IAddVarProps {
    addVar: (title: string) => void;
}

export class AddVar extends Component<IAddVarProps, IAddVarState> {

    constructor(props: IAddVarProps) {
        super(props);

        this.state = {

        }
    }
}
