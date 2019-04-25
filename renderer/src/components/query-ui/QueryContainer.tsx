import React, { Component, createRef } from 'react';
import { QueryInput } from './QueryInput';
import { QueryResult } from './QueryResult';
import Graph from '../graph/Graph';

import { IpcRenderer } from 'electron';
import { forumlaToJavaFormula } from '../util';
import { makeTitleFormula } from '../formula-input/helper';
const electron = (window as any).require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer: IpcRenderer = electron.ipcRenderer;

export interface INewModelData {
	name: string;
	exos: string[];
	endos: {
		name: string;
		formula: string;
	}[]
}

export interface IQueryData {
	context: {
		name: string;
		value: boolean;
	}[];
	cause: {
		name: string;
		value: boolean;
	}[];
	phi: string;
	solvingStrategy: string;
}

interface IQueryContainerState {
	result: object;
}

interface IQueryContainerProps {
	width: number;
	height: number;
	graph: Graph;
}

export class QueryContainer extends Component<IQueryContainerProps, IQueryContainerState> {

	private queryResultRef = createRef<QueryResult>();
	private queryInputRef = createRef<QueryInput>();
	private lastIdx = -1;

	constructor(props: IQueryContainerProps) {
		super(props);

		this.state = {
			result: {}
		}
	}

	componentDidMount() {
		ipcRenderer.on('query-result', this.onQueryResult)

		const graph = this.props.graph.getCurrentGraph();

		const endos = graph.nodes.filter(n => !n.isExogenousVariable).map(n => ({
			formula: forumlaToJavaFormula(makeTitleFormula(n.formula, graph.nodes)),
			name: n.title
		}))

		const exos = graph.nodes.filter(n => n.isExogenousVariable).map(n => n.title);
		this.setModel({
			endos,
			exos,
			name: graph.title
		})
	}

	componentWillUnmount() {
	}

	private onQueryResult = (event, result) => {
		if (this.queryResultRef.current !== null) {
			this.queryResultRef.current.addResult(this.lastIdx, result);
		}
	}

	private sendQuery = (query: IQueryData) => {
		if (this.queryResultRef.current !== null) {
			ipcRenderer.send('query', query)
			this.lastIdx = this.queryResultRef.current.addQuery(query);
		}
	}

	private setModel = (model: INewModelData) => {
		ipcRenderer.send('setModel', model);
	}

	private resetQuery = (data: IQueryData) => {
		if (this.queryInputRef.current !== null) {
			this.queryInputRef.current.setQuery(data);
		}
	}

	public render() {

		const { width, height, graph } = this.props;

		return <React.Fragment>
			<QueryInput
				query={this.sendQuery}
				width={width}
				graph={graph}
				ref={this.queryInputRef}
			/>
			<QueryResult
				ref={this.queryResultRef}
				result={this.state.result}
				height={height}
				width={width}
				reSetQuery={this.resetQuery}
			/>
		</React.Fragment>
	}
}