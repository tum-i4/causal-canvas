import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import { fileMenuTemplate } from './menu/file';
import { helpMenuTemplate } from './menu/help';
import * as fs from 'fs-extra';
import { HP2SATConnector } from './hp2satConnector';
import { loadeExtensions } from './loadExtendsions';
import { editMenuTemplate } from './menu/edit';
let mainWindow: Electron.BrowserWindow
let filePaths = new Map<string, string>();
async function onReady() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 900,
	})

	const hp2satConnector = await HP2SATConnector.create();
	// console.log(fs.readdirSync(__dirname));
	// console.log(__dirname);
	// console.log(app.getPath('appData'));
	mainWindow.maximize();
	// mainWindow.webContents.toggleDevTools();


	// const extensions = await loadeExtensions();
	// console.log(extensions);
	// extensions[0].algorithm('yolo');

	Menu.setApplicationMenu(
		Menu.buildFromTemplate([
			...fileMenuTemplate,
			...editMenuTemplate,
			...helpMenuTemplate,
		])
	);

	const devDileName = `http://localhost:3000`
	const prodFileName = `file://${__dirname}/index.html`;
	mainWindow.loadURL(process.env.NODE_ENV === 'development' ? devDileName : prodFileName);
	mainWindow.on('close', () => app.quit());

	ipcMain.on('saveToFile', (event: any, data: string) => {

		const jsonData = JSON.parse(data);
		const currentPath = filePaths.get(jsonData.id) || '';
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
			filePaths.set(jsonData.id, fileName);
			fs.writeFile(fileName, jsonData.data, (err) => console.log(err));
		})
	})

}

app.on('ready', () => onReady());
app.on('window-all-closed', () => app.quit());

console.log(`Electron Version ${app.getVersion()}`)
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

ipcMain.on('export', (event: any, data: string, type: string) => {
	dialog.showSaveDialog({
		filters: [{ name: type, extensions: [type] }]
	}, (fileName: string) => {
		if (fileName === undefined) {
			return;
		}
		fs.writeFile(fileName, data, (err) => console.log(err));
	})
})