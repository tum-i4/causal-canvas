import * as net from 'net';
import * as child_process from 'child_process';
import * as path from 'path';

const PATH_TO_JAR = path.join(__dirname, '..', 'java-tools', 'hp2sat', 'hp2sat.server-1.jar');

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

export class HP2SAT {

	private client: net.Socket | undefined = undefined;
	private static server: child_process.ChildProcess | undefined = undefined;

	private constructor(socket: net.Socket) {
		this.client = socket;

		socket.on('close', () => {
			this.client = undefined;
			console.log('closed');
		});

		socket.on('error', (err) => {
			this.client = undefined;
			console.log(err);
		})
	}

	public static create(): Promise<HP2SAT | undefined> {

		const port: number = 4040;
		const host: string = 'localhost';

		return new Promise<HP2SAT | undefined>(async (resolve, reject) => {
			if (this.server === undefined) {
				await this.startServer(port);
			}
			const socket = new net.Socket();

			const errorListener = (err: Error) => {
				console.log(err);
				resolve(undefined);
			}
			socket.once('error', errorListener);

			socket.connect(port, host, () => {
				console.log('connected');
				socket.removeListener('error', errorListener)
				resolve(new HP2SAT(socket));
			});
		})
	}

	private static async startServer(port: number): Promise<void> {
		const server = child_process.spawn('java', ['-jar', `${PATH_TO_JAR}`, String(port)]);
		process.once('exit', () => server.kill());
		this.server = server;
		server.on('exit', () => this.server = undefined);
		server.stdout.pipe(process.stdout);
		server.stderr.pipe(process.stderr);
		const timeout = ms => new Promise(res => setTimeout(res, ms))
		await timeout(1000);
	}

	public async setModel(model: INewModelData): Promise<string> {
		const result = await this.sendMessage(`new-model::${JSON.stringify(model)}`);
		return result;
	}

	public async query(data: IQueryData): Promise<string> {
		return this.sendMessage(`query::${JSON.stringify(data)}`);
	}

	private sendMessage(data: string): Promise<string> {
		return new Promise<any>((reoslve, reject) => {
			this.client.once('data', (data) => {
				reoslve(data.toString('utf8').replace(/\n/g, ''));
			})
			this.client.write(`${data}\n`);
		})
	}
}