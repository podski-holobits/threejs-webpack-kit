import Stats from 'stats.js';
import Dat from 'dat.gui';

export default class DebuGui {

    constructor(app, enabled) {
        //Always define reference to the main app for this class context
        this.app = app;
        //Enabled flag
        this.enabled = enabled;    
        //Real init functions
        //Init stats display
		this.initStats();
        if(enabled) {this.enable()};

		// this.disable();
	}

	initStats() {
		this.stats = new Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
		document.body.appendChild(this.stats.dom);
	}


	//---------------------------------------------------------------------------------------------
	// PUBLIC
	//---------------------------------------------------------------------------------------------
    //Enable GUI DEBUG display
	enable() {
        if (this.stats) this.stats.dom.style.cssText = 'position:absolute;top:20px;left:370px;';
        this.enabled = true;
	}

    //Disable GUI DEBUG display
	disable() {
		if (this.stats) this.stats.dom.style.display = 'none';
        this.enabled = false;
    }
    
    //Toggle GUI DEBUG display
	toggle() {
		if (this.enabled) this.disable();
		else this.enable();
    }
    
	//---------------------------------------------------------------------------------------------
	// PUBLIC RENDER 
	//---------------------------------------------------------------------------------------------
	update() {
		if (this.stats) this.stats.begin();
    }
    
	render() {
		if (this.stats) this.stats.end();
	}
}