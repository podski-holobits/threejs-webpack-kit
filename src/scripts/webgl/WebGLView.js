import 'three';

export default class WebGLView {

    constructor(app) {
        //Always define reference to the main app for this class context
        this.app = app;
        
        this.initThree();
        //this.initInteractions();
        this.initEnvironment();
        this.initLights();
	}

	initThree() {
		// Initialize scene
		this.scene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set( 0, 0, 80 );

		// renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true});
        this.renderer.setPixelRatio( window.devicePixelRatio );

        // clock
		//this.clock = new THREE.Clock(true);
	}

	initEnvironment() {
        
		this.scene.background = new THREE.Color( 0xcccccc );
        this.scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
        
        var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set( 0, 0, 0 );
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        this.scene.add( mesh );
    }

    initLights()
    {
        this.light1 = new THREE.DirectionalLight( 0xffffff );
		this.light1.position.set( 1, 1, 1 );
		this.scene.add( this.light1 );

        this.light2 = new THREE.DirectionalLight( 0x002288 );
		this.light2.position.set( - 1, - 1, - 1 );
		this.scene.add( this.light2 );

        this.light3 = new THREE.AmbientLight( 0x222222 );
		this.scene.add( this.light3 );
    }
	//---------------------------------------------------------------------------------------------
	// PUBLIC RENDER 
	//---------------------------------------------------------------------------------------------
	update() {
    }
    
	render() {
		this.renderer.render( this.scene, this.camera );
    }
    

    
	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
        if (!this.renderer) return;

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        
        
    }
}