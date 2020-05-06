import Stats from 'stats.js';
import DebuGui from './gui/DebuGui.js';

export default class App {
    constructor() {
        //this.self = this;
        //this.stats = new Stats();
    }


        init() {
            this.initDebuGui();
            
            //At the end - add all the callback listeners (for binding context)
		    this.addListeners();
        }

        initDebuGui() {
            this.debugui = new DebuGui(this,true);
        }

        addListeners() {
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
    
        this.rafLoop = requestAnimationFrame(this.handlerAnimate);
    }
	update() {
		if (this.gui) this.debugui.update();
    }
    
	render() {
		if (this.gui) this.debugui.render();
	}
}