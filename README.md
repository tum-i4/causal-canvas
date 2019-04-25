# causal-canvas

a canvas to interact with causal models based on the HP-defenition

## build:

nodejs & npm must be installed

1) starting from the project root dir
2) run 'npm install'
3) change to render dir and run 'npm install'
4) change to main dir and run 'npm install'
5) change to project root dir and run 'npm run build'

- to choose the target platform, go in the build.js file and comment in/out the platform you want to build for
- first time building for a platform requiers internet connection to downloade the platform specific files
- to update the jar's just replace tham in the main/java-tools/xxx dir
- build proccess is done with <https://github.com/electron-userland/electron-packager>


## for dev:

1) starting from the project root dir
2) change to render dir and run 'npm install' and 'npm start'
3) change to main dir and run 'npm install' and 'npm start'

changes in the render process are reloaded on save
for changes in the main procces the app must be closed and run npm start again