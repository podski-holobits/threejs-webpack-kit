import 'three';
import { OrbitControls } from 'three-examples/controls/OrbitControls.js'
import AssetLoader from './AssetLoader.js';
import foxGltfPath from '../../assets/gltf/monkey.glb';
import monkeyGltfPath from '../../assets/gltf/monkey.glb';
import torusGltfPath from '../../assets/gltf/torus.glb';

export default class WebGLView {

    constructor(app) {
        //Always define reference to the main app for this class context
        this.app = app;
        
        this.initThree();
        this.initInteractions();
        this.initLoader();
        this.initEnvironment();
        this.initModels();
        this.initLights();
        console.log("[M] App initialized")
	}

	initThree() {
		// Initialize scene
		this.scene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set( 0, 120, 150 );
        this.camera.setViewOffset ( window.innerWidth , window.innerHeight, 0, -50, window.innerWidth , window.innerHeight)
		// renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true});
        this.renderer.setPixelRatio( window.devicePixelRatio );

        // clock
		//this.clock = new THREE.Clock(true);
	}

    initInteractions()
    {
        // controls

				this.controls = new OrbitControls( this.camera, this.renderer.domElement );

				//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

				this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
				this.controls.dampingFactor = 0.05;

				this.controls.screenSpacePanning = false;

				this.controls.minDistance = 100;
				this.controls.maxDistance = 500;

				this.controls.maxPolarAngle = Math.PI / 2;
				this.controls.target.set(0,15,0);
    }
    initLoader()
    {
        this.assetloader = new AssetLoader(this.app);
    }

	initEnvironment() {
        
		this.scene.background = new THREE.Color( 0xcccccc );
        this.scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
        
        var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 8, 1 );
		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set( 0, 15, 0 );
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        //this.scene.add( mesh );

        this.xposition = 7.5;

        mesh = new THREE.Mesh( geometry, material );
        mesh.scale.set( 0.5, 0.5, 0.5 );
        mesh.position.set( 40, 7.5, 0);

        //Add debug manipulation
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = true;
        this.scene.add( mesh );

        
        mesh = new THREE.Mesh( geometry, material );
        mesh.scale.set( 0.5, 0.5, 0.5 );
        mesh.position.set( -40, 7.5, 0);
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = true;
        this.scene.add( mesh );

        
        mesh = new THREE.Mesh( geometry, material );
        mesh.scale.set( 0.5, 0.5, 0.5 );
        mesh.position.set( 0, 7.5,-40);
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        this.scene.add( mesh );

        
        mesh = new THREE.Mesh( geometry, material );
        mesh.scale.set( 0.5, 0.5, 0.5 );
        mesh.position.set( 0, 7.5, 40);
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        this.scene.add( mesh );
    }
    initModels()
    {
        this.assetloader.gltfLoader.load( foxGltfPath,  ( gltf ) => {

               //var  mixer = new THREE.AnimationMixer( gltf.scene );
                //var action = mixer.clipAction( gltf.animations[ 0 ] );
               // action.play();
                
             this.app.debugui.dgui.add(gltf.scene.position, 'y',  -15, 15);
                this.scene.add( gltf.scene );
        
            },
            // called while loading is progressing
            ( xhr ) =>  {
        
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        
            },
            // called when loading has errors
            ( error ) =>  {
        
                console.log( 'An error happeneddd' );
                console.log("Error", error.name);
                console.log("Error", error.message);
            }
         );
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
        this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
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
        this.camera.updateProjectionMatrix();
		this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        
        
    }
}