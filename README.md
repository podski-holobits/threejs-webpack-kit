# threejs-webpack-kit 
## A template for three.js projects based on webpack
[https://github.com/podski-holobits/threejs-webpack-kit](https://github.com/podski-holobits/threejs-webpack-kit)

## Soon available on npm 

 Coming soon...
 Pst! You will be able soon to run 
```
npm install @podski/threejs-webpack-kit 
```
 instead of having to download the package from github.

## Run for development
Install: 
```
npm install
```
Run:
```
npm start:dev
```
* Starts up webpack server at localhost:8080 and opens browser. Hot mode enabled; 
* dynamically keeps track of changes to js files
* currently cleans the production 'dist' folder on start, to be changed


## Build
```
 `npm run build:prod`
```
* cleans the production 'dist' folder on start


## Structure (in progress)
```
dist - Directory for built distributionfiles from the npm build:prod script
src - Directory for all development files (js, hmtl, images, shaders)
├── css - Contains all source CSS and SCSS files, that are compiled to `dist/css`
├── scripts - Contains all the js script files, without the entry point script
├── assets - Contains all the asset  files. 
    └── img - Contains image files 
    └── gltf - Contains gltf 3d files 
└── shaders - Contains all shader files ().frag and .vert  files)
```
## Libraries
- [Three.js](https://github.com/mrdoob/three.js/) - main hero, three.js library to make WebGL a bit more managable.
- [stats.js](https://github.com/mrdoob/stats.js/) - standard performance monitor for three.js
- [glslify](https://github.com/glslify/glslify) - node.js-style module system for GLSL, allows  to install GLSL modules from npm and use in shaders. Provided and supported by [#stackgl](http://stack.gl/).
- [gsap](https://www.npmjs.com/package/gsap) - animation platform, to make things smooth and nice.


## Alternatives

## Inspired by:
- the structure of [interactive-particles](https://github.com/brunoimbrizi/interactive-particles) project by Bruno Imbrizi;
- the structure of [ThreeJS-Webpack-ES6-Boilerplate](https://github.com/paulmg/ThreeJS-Webpack-ES6-Boilerplate/) project by paulmg - I tried to make sth a bit simpler and more understandable for my rudimentary JS knowledge;


[© Piotr Podziemski 2020](http://www.holobits.pl)
