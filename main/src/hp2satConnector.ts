import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import { HP2SAT } from './java-tools-wrapper/hp2sat-server';

export class HP2SATConnector {

    constructor(private hp2sat: HP2SAT) {

    }

    static async create() {
        const newConnector = new HP2SATConnector(await HP2SAT.create());
        ipcMain.on('setModel', newConnector.setModel);
        ipcMain.on('query', newConnector.query);
        return newConnector;
    }

    public setModel = (event, data) => {
        console.log(data);
        this.hp2sat.setModel(data);
    }

    public query = async (event, data) => {
        console.log(data);
        const result = await this.hp2sat.query(data);
        BrowserWindow.getFocusedWindow().webContents.send('query-result', JSON.stringify({
            time: new Date().toISOString(),
            query: data,
            result,
        }))
    }

}