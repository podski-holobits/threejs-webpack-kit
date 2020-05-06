import Stats from 'stats.js';
import DebuGui from './gui/DebuGui.js';
import WebGLView from './webgl/WebGLView.js';

export default class App {
    constructor() {
        //this.self = this;
        //this.stats = new Stats();
    }


        init() {
            this.initDebuGui();
            this.initWebGLView();
            //At the end - add all the callback listeners (for binding context)
            this.addListeners();
            this.animate();
		    this.resize();
        }

        initDebuGui() {
            this.debugui = new DebuGui(this,true);
        }

        initWebGLView() {
            this.glview = new WebGLView(this);
		    document.querySelector('.container').appendChild(this.glview.renderer.domElement);
        }

        addListeners() {
		    window.addEventListener('resize', this.resize.bind(this));
            this.handlerAnimate = this.animate.bind(this);
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
    animate() {
        this.update();
        this.render();
    
        requestAnimationFrame(this.handlerAnimate);
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