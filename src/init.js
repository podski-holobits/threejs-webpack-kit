import 'normalize.css'
import './css/main.scss' //Loads scss into projects - init.js is the starting point for webpack
import ready from 'domready';
import App from './scripts/app.js';

ready(() => {
	window.app = new App();
	window.app.init();
});