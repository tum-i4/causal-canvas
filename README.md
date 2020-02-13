# Causal-Canvas

An interactive platform to operationalize actual causality reasoning. For details, please refer to the following ECAI 2020 paper:
Actual Causality Canvas: A General Framework for Explanation-based Socio-Technical Constructs

# Academic Citation 
Please cite the following paper (to appear) when using this Canvas. 

@inproceedings{ibrahim2020,
	author={Ibrahim, Amjad and Klesel, Tobias and Zibaei, Ehsan and Kacianka, Severin and Pretschner, Alexander},
	title     = {Actual Causality Canvas: A General Framework for Explanation-based Socio-Technical Constructs},
	booktitle = {ECAI},
	year      = {2020},
   publisher={IOS Press},
}



## How to Install:
1- Download the specific platform distribution zip file 
2- Extract the compressed file, locate causal-canvas executable in the root of the extracted folder 
3- Run the executable (double click on windows, on Linux, either use your GUI option to make it executable or run using a terminal with ./causal-canvas (may need to grant 'execute' permissions before))
4- Start using the Canvas by creating a causal model using one of the options:
	a.) From scratch (e.g., shift+click to create a node) 
	b.) Import a fault tree or any other supported formats (we  added the drone model in the folder models)
	c.) Use the example from the help menu. 
5- For a quick animated tutorial, check the GIFs in the models folder. 	
Note: the canvas was tested with a windows 10 and Ubuntu 16.04 LTS	


## Build:

nodejs  & npm must be installed (node installs npm from (https://nodejs.org/en/download/))

1) starting from the project root dir
2) run 'npm install'
3) change to render dir and run 'npm install'
4) change to main dir and run 'npm install'
5) change to project root dir and run 'npm run build'

- to choose the target platform, go in the build.js file and comment in/out the platform you want to build for
- first time building for a platform requiers internet connection to downloade the platform specific files
- to update the jar's just replace tham in the main/java-tools/xxx dir
- build proccess is done with <https://github.com/electron-userland/electron-packager>

### Development:

1) starting from the project root dir
2) change to render dir and run 'npm install' and 'npm start'
3) change to main dir and run 'npm install' and 'npm start'

changes in the render process are reloaded on save
for changes in the main procces the app must be closed and run npm start again
