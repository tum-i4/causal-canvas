import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import { fileMenuTemplate } from './menu/file';
import { helpMenuTemplate } from './menu/help';
import * as fs from 'fs-extra';
import { HP2SATConnector } from './hp2satConnector';
let mainWindow: Electron.BrowserWindow
let currentPath = '';
async function onReady() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 900
	})

	const hp2satConnector = await HP2SATConnector.create();
	mainWindow.maximize();
	// mainWindow.webContents.toggleDevTools();


	Menu.setApplicationMenu(
		Menu.buildFromTemplate([
			...fileMenuTemplate,
			...helpMenuTemplate
		])
	);

	const devDileName = `http://localhost:3000`
	const prodFileName = `file://${__dirname}/index.html`;
	mainWindow.loadURL(process.env.NODE_ENV === 'development' ? devDileName : prodFileName);
	mainWindow.on('close', () => app.quit());

	ipcMain.on('saveToFile', (event: any, data: string) => {

		const jsonData = JSON.parse(data);
		if (jsonData.type === 'save' && currentPath !== '') {
			fs.writeFile(currentPath, jsonData.data, (err) => console.log(err));
			return;
		}

		dialog.showSaveDialog({
			filters: [{ name: 'causalmodel', extensions: ['causalmodel'] }]
		}, (fileName: string) => {
			if (fileName === undefined) {
				return;
			}
			currentPath = fileName;
			fs.writeFile(fileName, jsonData.data, (err) => console.log(err));
		})
	})


}

app.on('ready', () => onReady());
app.on('window-all-closed', () => app.quit());

console.log(`Electron Version ${app.getVersion()}`)
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// ipcMain.on('export', (event: any, data: string) => {
// 	dialog.showSaveDialog({}, (fileName: string) => {
// 		if (fileName === undefined) {
// 			return;
// 		}
// 		fs.writeFile(fileName, data, (err) => console.log(err));
// 	})
// })

export function setCurrentPath(path: string) {
	currentPath = path;
}