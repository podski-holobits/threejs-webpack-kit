import Stats from 'stats.js';


export default class App {
    constructor() {
        this.self = this;
        this.stats = new Stats();
    }

	initStats() {
        this.handlerAnimate = this.animateStats.bind(this);
        this.stats.dom.style.cssText = 'position:absolute;top:20px;left:370px;';
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );
    }

    animateStats() {
        this.stats.begin();


        // monitored code goes here

        this.stats.end();

        requestAnimationFrame( this.handlerAnimate);

    }
}