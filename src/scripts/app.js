import Stats from 'stats.js';
import DebuGui from './gui/DebuGui.js';
import WebGLView from './webgl/WebGLView.js';

export default class App {
    constructor() {
        //this.self = this;
        //this.stats = new Stats();
    }


    init() {
        this.htmlcontainer = document.getElementById('three_container');
        this.initDebuGui();
        this.initWebGLView();
        //At the end - add all the callback listeners (for binding context)
        this.addListeners();
        //this.animate();
        this.resize();


        this.now = 0;
        this.then = 0;
        this.delta = 0;
        this.fps = 60;
        this.interval = 1000 / this.fps;


        //Framerate is defined to have maximum of 60Hz
        window.requestAnimationFrame = function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                function (f) {
                    window.setTimeout(f, this.interval).bind(this);
                }
        }();

        this.handlerAnimate();

    }

    initDebuGui() {
        this.debugui = new DebuGui(this, true);
    }

    initWebGLView() {
        this.glview = new WebGLView(this);
        document.querySelector('.container').appendChild(this.glview.renderer.domElement);
    }

    addListeners() {
        window.addEventListener('resize', this.resize.bind(this));
        //this.handlerAnimate = this.animate.bind(this);
    }


    /*	initStats() {
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
    
        }*/


    //---------------------------------------------------------------------------------------------
    // PUBLIC RENDER 
    //--------------------------------------------------------------------------------------------- 
    handlerAnimate() {

        requestAnimationFrame(this.handlerAnimate.bind(this));
        this.now = Date.now();
        this.delta = this.now - this.then;

        if (this.delta > this.interval) {

            this.then = this.now - (this.delta % this.interval);
            this.animate();
            //this.animate.bind(this);
            // ... Code for Drawing the Frame ...
            // var time_el = (then - first)/1000;
            //$('#frame_count').innerHTML = ++counter + 'f / ' + parseInt(time_el) + 's = ' + parseInt(counter/time_el) + 'fps';
        }

    }
    animate() {
        //this.update();
        //this.render();
        //requestAnimationFrame(this.handlerAnimate);
    }
    update() {
        if (this.glview) this.glview.update();
        if (this.debugui) this.debugui.update();
    }

    render() {
        if (this.glview) this.glview.render();
        if (this.debugui) this.debugui.render();
    }


    // ---------------------------------------------------------------------------------------------
    // EVENT HANDLERS
    // ---------------------------------------------------------------------------------------------
    resize() {
        if (this.glview) this.glview.resize();
    }

}