const packager = require('electron-packager');
const fs = require('fs-extra');
const path = require('path');
const child_process = require('child_process');

(async function () {
	//todo: choose platform

	await build('darwin', false);
	// await build('linux',false);
	// await build('win32',false);

})().then(() => undefined).catch(() => undefined)

function build(platform, install = false) {
	return new Promise(async (reoslve, reject) => {
		console.log('build');
		if (install) {
			console.log('npm install...');
			await exec('npm install', path.join(process.cwd(), 'main'));
			await exec('npm install', path.join(process.cwd(), 'renderer'));
		}
		console.log('main...');
		await exec('npm run build:prod', path.join(process.cwd(), 'main'));
		console.log('renderer...');
		await exec('npm run build', path.join(process.cwd(), 'renderer'));
		console.log('packaging');
		await electronPackager(platform);
		console.log('copy renderer');
		copyRenderer();
	})
}

function electronPackager(platform) {
	return new Promise((resolve) => {
		packager({
			dir: './main',
			overwrite: true,
			platform: platform,
			arch: 'x64',
			name: 'causal-canvas',
			// icon: './logo.ico'
		})
			.then(appPaths => {
				resolve();
			})
	})
}

function copyRenderer() {

	const rendererBuildPath = path.join(__dirname, 'renderer', 'build');
	// const rendererDestPath = path.join(__dirname, 'causal-canvas-win32-x64', 'resources', 'app', 'dist');
	const rendererDestPath = path.join(__dirname, 'causal-canvas-darwin-x64', 'causal-canvas.app', 'Contents', 'Resources', 'app', 'dist');

	const existsRenderrBuild = fs.existsSync(rendererBuildPath);
	if (!existsRenderrBuild) {
		console.log("RENDERER BUILD NOT FOUND");
		return;
	}

	copyDir(rendererBuildPath, rendererDestPath);
}

function copyDir(src, dest) {
	const files = fs.readdirSync(src);
	for (const file of files) {

		const srcFilePath = path.join(src, file);
		const destFilePath = path.join(dest, file);
		const stats = fs.statSync(srcFilePath);

		if (stats.isDirectory()) {
			fs.mkdirSync(destFilePath);
			copyDir(srcFilePath, destFilePath);
		} else {
			fs.copyFileSync(srcFilePath, destFilePath)
		}
	}
}

function exec(command, cwd) {
	return new Promise((resolve, reject) => {
		child_process.exec(command, {
			cwd,
		}, (error, stout, sterr) => {
			if (error) {
				// console.log(sterr);
				console.log(error);
				return reject(error);
			}
			// console.log(stout);
			resolve();
		});
	})
}