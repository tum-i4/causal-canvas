import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import { fileMenuTemplate } from './menu/file';
import { helpMenuTemplate } from './menu/help';

let mainWindow: Electron.BrowserWindow

function onReady() {
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 900
	})

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