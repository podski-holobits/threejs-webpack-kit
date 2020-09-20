import Stats from 'stats.js';
import dat from 'dat.gui';

export default class DebuGui {

    constructor(app, enabled) {
        //Always define reference to the main app for this class context
        this.app = app;
        //Enabled flag
        this.enabled = enabled;    
        //Real init functions
        //Init stats display
		this.initStats();
		this.initDatGui();
        if(enabled) {this.enable()};

		// this.disable();
	}

	initStats() {
		this.stats = new Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
		document.body.appendChild(this.stats.dom);
	}

	initDatGui() {
		this.dgui = new dat.GUI({ autoPlace: false });
		this.customContainer = document.getElementById('dgui-container');
		this.customContainer.appendChild(this.dgui.domElement);

		//For produtction:
		//this.customContainer.style.visibility = "hidden";


	  
		//Adds 
		dat.GUI.prototype.addThreeColor=function(obj,varName){
			// threejs & dat.gui have color incompatible formats so we use a dummy data as target :
			var dummy={};
			// set dummy initial value :
			dummy[varName]=obj[varName].getStyle(); 
			return this.addColor(dummy,varName)
				.onChange(function( colorValue  ){
					//set color from result :
					obj[varName].setStyle(colorValue);
				});
		};
		dat.GUI.prototype.addThreeUniformColor=function(material,uniformName,label){
			return this.addThreeColor(material.uniforms[uniformName],"value").name(label||uniformName);
		};
	}
	get datGui()
	{
		return this.dgui;
	}

	//---------------------------------------------------------------------------------------------
	// PUBLIC
	//---------------------------------------------------------------------------------------------
    //Enable GUI DEBUG display
	enable() {
        if (this.stats) this.stats.dom.style.cssText = 'position:absolute;top:15px;left:10px;z-index:20000;';
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