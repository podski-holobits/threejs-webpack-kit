import 'three';
import { OrbitControls } from 'three-examples/controls/OrbitControls.js'
import AssetLoader from './AssetLoader.js';
import GlHelper from './GlHelper.js';
import RroboGltfPath from '../../assets/gltf/roboquick.glb';

//----------------------------------------------------
// Imports - other libraries
//----------------------------------------------------
import { gsap } from "gsap";
import glslify from "glslify";


//----------------------------------------------------
// Imports - shaders and textures
//----------------------------------------------------
import RoboAo from "../../assets/img/robo_ao3.png";
import PerlinNoise from "../../assets/img/perlin-noise-texture.jpg";
import DiscTexture from "../../assets/img/disc.png";
import GradientTexture from "../../assets/img/gradient.png";
import GradientCapTexture from "../../assets/img/gradient-top.png";
import PointFragShader from "../../shaders/floorpoint_dev.frag";
import PointVertShader from "../../shaders/floorpoint_dev.vert";

export default class WebGLView {

    constructor(app) {
        //Always define reference to the main app for this class context
        this.app = app;
        this.MINDEVICEPIXELRATIO = 2;
        

        this.initThree();
        this.initLoader();
        this.initSceneConstants();
        this.initInteractions();
        //this.initAudio();
        this.initEnvironment();

        this.initModels();
        this.initLights();

        this.addListeners();
        console.log("[I] App initialized")

        console.log(this.scene);
	}

    initSceneConstants() {
        //Private fields, arrays etc.
        this.currentCameraPos = new THREE.Vector3();
        this._clientClicking = false;

        this.raycastingObjects = [];
        this.debugObjects = [];
        

        //Environment settings
        this.fogDensity = 0.005;

        //Particles
            this.particleUniforms = [];
            this.numParticles = 812;
            this.minMovement = 1;
            this.maxMovement = 1;
            this.particleColor = new THREE.Color("rgb(175,188,175)");
            this.particleColorAnatomy = new THREE.Color("rgb(130,130,130)");


        //Colors
        this.colorLine = new THREE.Color("rgb(173,173,173)"); //main timeline color//"rgb(25, 27, 25)"
        this.colorFont = new THREE.Color("rgb(83,83,83)"); //"rgb(25, 27, 25)"

        this.colorBackground = new THREE.Color("rgb(70,70,70)"); //"rgb(25, 27, 25)"
        this.groundColor = new THREE.Color("#rgb(248,248,248)");
        this.groundEmissive=  new THREE.Color("rgb(85,85,85)");

        //Materials
        this.noise = new THREE.TextureLoader().load(PerlinNoise);
        this.spriteDisc = new THREE.TextureLoader().load(DiscTexture);

        this.roboAoTexture = this.assetLoader.textureLoader.load(RoboAo);
        this.roboAoTexture.encoding = THREE.sRGBEncoding;
        this.roboAoTexture.flipY = false;
        this.roboAoTexture.magFilter = THREE.LinearFilter;
        this.roboAoTexture.minFilter = THREE.LinearFilter;


        this.roboMaterial = new THREE.MeshPhysicalMaterial( {
            metalness: 0.0,
            roughness: 0.1,
            clearcoat: 1.0,
            side:  THREE.FrontSide,
            dithering: true,
            map: this.roboAoTexture,
            //normalMap: normalMap4,
            //clearcoatNormalMap: clearcoatNormaMap,

            // y scale is negated to compensate for normal map handedness.
            //clearcoatNormalScale: new THREE.Vector2( 2.0, - 2.0 )
        } );
        this.materialBlack = new THREE.MeshPhongMaterial( {
            color: 0x000000,
            shininess: 0.7,
            specular: 0x000000,
            transparent:false,
            side:  THREE.FrontSide
        } );
    }

	initThree() {
		// Initialize scene
        this.renderer = new THREE.WebGLRenderer({ antialias: true});
        //var renderer = new THREE.WebGLRenderer({ alpha: true });
        this.pixelRatio = Math.min(this.MINDEVICEPIXELRATIO, window.devicePixelRatio);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;


		// camera
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 3000);
        

        this.camera.position.set( -20, 30, 120 );
        this.camera.setViewOffset ( window.innerWidth , window.innerHeight, 0, 0, window.innerWidth , window.innerHeight)

		// renderer

		this.scene = new THREE.Scene();
        this.canvas = this.renderer.domElement;
        this.clock = new THREE.Clock(true);
        
        //Init base configuration bools
            this._modelsLoaded = false;

        //Raycasting
            this.raycaster = new THREE.Raycaster();
            this._mouse = new THREE.Vector2();
            this._clientMouse = new THREE.Vector2();
        //---------------------
        // GUI
        //---------------------
        //Buttons in menu
        var obj = { DEBUG: this.toggleDebug.bind(this) };
        app.debugui.dgui.add(obj, "DEBUG");
	}

    initInteractions()
    {
        // controls

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

        this.controls.screenSpacePanning = false;
        this.controls.enablePan = false;
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.05;

        this.controls.screenSpacePanning = false;

        this.controls.minDistance = 100;
        this.controls.maxDistance = 500;

        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.target.set(0,15,0);

        this.controls.enabled = true;
        
    }
    initLoader()
    {
        this.assetLoader = new AssetLoader(this.app);
        this.renderer.domElement.addEventListener(
          "ModelsLoaded",
          this.loadingFinished.bind(this),
          false
        );
    }

	initEnvironment() {
        
        this.groundMaterial = new THREE.MeshPhongMaterial( {
            color: this.groundColor ,
            emissive: this.groundEmissive,
            shininess: 0,
            specular: 0x000000,
            dithering: true,
            side:  THREE.DoubleSide,
           } );
        this.groundEmissiveIntensity= 1.0;
		this.scene.background = new THREE.Color( this.colorBackground);
        //this.scene.background = null; //for transparent background
        this.scene.fog = new THREE.FogExp2( this.colorBackground, this.fogDensity);
        //this.initSkybox();
        
        var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 8, 1 );
		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true, side: THREE.DoubleSide} );



        
        //Ground materials
        var geometryGround = new THREE.PlaneBufferGeometry( 5000, 5000, 10, 10 );

        this.ground = new THREE.Mesh( geometryGround, this.groundMaterial );
        this.ground.name = "ground";
        this.ground.position.set( 0, -0.2, 0);
        this.ground.rotation.x = -Math.PI/2;
        this.ground.castShadow = false;
        this.ground.receiveShadow = true;
        this.ground.matrixAutoUpdate  = false;
        this.ground.updateMatrix();
        this.scene.add( this.ground );


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


        
        //---------------------
        // GUI
        //---------------------
            app.debugui.folder_environment = this.app.debugui.dgui.addFolder(
                `Environment`
            );
            this.app.debugui.folder_environment.addThreeColor(this, "colorBackground").name("Background Color");
            this.app.debugui.folder_environment.addThreeColor(this.ground.material, 'color').name("ground Color");
            this.app.debugui.folder_environment.addThreeColor(this.ground.material, 'emissive').name("ground emissive");
            this.app.debugui.folder_environment.add(this.ground.material, 'emissiveIntensity',0,5).name("ground emissiveIntensity");
                
            this.app.debugui.folder_environment
            .add(this, "fogDensity", 0, 0.02)
            .onChange(
                function (value) {
                this.scene.fog.density = this.fogDensity;
                }.bind(this)
            );
            //this.app.debugui.dgui.close();
    }
    initSkybox() {
        var texture = new THREE.TextureLoader().load(GradientTexture);
        var textureCap = new THREE.TextureLoader().load(GradientCapTexture);
        texture.wrapS = THREE.RepeatWrapping;
        textureCap.wrapT = THREE.RepeatWrapping;
        textureCap.wrapS = THREE.RepeatWrapping;
    
        var materialSides = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide,
          fog: false,
        });
        var materialCaps = new THREE.MeshBasicMaterial({
          map: textureCap,
          side: THREE.BackSide,
          fog: false,
        });
    
        var materialArray = [];
        materialArray.push(materialSides);
        materialArray.push(materialSides);
        materialArray.push(materialCaps);
        materialArray.push(materialCaps);
        materialArray.push(materialSides);
        materialArray.push(materialSides);
        var skyGeometry = new THREE.CubeGeometry(2000, 2000, 2000);
        //var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
        this.skyBox = new THREE.Mesh(skyGeometry, materialArray);
        this.scene.add(this.skyBox);
    }
    initModels()
    {
        var model = new THREE.Object3D();
        this.assetLoader.gltfLoader.load( RroboGltfPath,  ( gltf ) => {

            //Add model
            model = gltf.scene;
            model.name = "Robot";
            model.scale.set( 14, 14, 14 );
            model.rotation.y = -Math.PI/2;
            
            model.traverse( GlHelper.disposeMaterial );///
            
            //Setup materials for bloom scene and shadow
            model.traverse((o) => {
                if (o.name == "Cube_0")  {
                    console.log("isMesh")
                    console.log(o)
                    o.castShadow = true;
                    o.receiveShadow = true;
                    o.material = this.roboMaterial; 

                    //if(isRaycasted)
                    //{
                        //Define bounding box
                        o.geometry.computeBoundingBox();
                        model.boundingSize = new THREE.Vector3();
                        o.geometry.boundingBox.getSize(model.boundingSize);

                        var iboxgeometry = new THREE.BoxBufferGeometry( model.boundingSize.x, model.boundingSize.y*2,model.boundingSize.z,1,1,1 );
                        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: true, opacity: 0.5} );
                        var cube = new THREE.Mesh( iboxgeometry, material );

                        cube.geometry.computeBoundingBox();
                        //cube.rotation.x = -Math.PI/2;
                        //cube.position.y = -o.geometry.boundingBox.min.z - model.boundingSize.z/2.0;

                        cube.visible = false;
                        cube.name = 'intersectBox';
                        this.debugObjects.push(cube);
                        model.add(cube );
                    //}

                }
            });

            //var  mixer = new THREE.AnimationMixer( gltf.scene );
            //var action = mixer.clipAction( gltf.animations[ 0 ] );
            // action.play();
                
            this.app.debugui.dgui.add(model.position, 'y',  -3, 25).name("y position");
            this.scene.add( model );
        
            },
            // called while loading is progressing
            ( xhr ) =>  {
                //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            ( error ) =>  {
                console.log( '[E] An error on gltf loading' );
                console.log("[E] Error", error.name);
                console.log("[E] Error", error.message);
            }
         );
    }
    initLights()
    {
        this.light1 = new THREE.DirectionalLight( 0xffffff );
		this.light1.position.set( 1, 1, 1 );
		this.scene.add( this.light1 );

        this.light2 = new THREE.DirectionalLight( 0x888888 );
		this.light2.position.set( - 1, - 1, - 1 );
		this.scene.add( this.light2 );

        this.light3 = new THREE.AmbientLight( 0x222222 );
		this.scene.add( this.light3 );
    }
    loadingFinished()
    {
        console.log("[M] Loading finished")
    }
	//---------------------------------------------------------------------------------------------
	// PUBLIC RENDER 
	//---------------------------------------------------------------------------------------------
	update() {
        this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

        
        //DEBUG ONLY
        this.setBackgrounds();
    }
    //Perform action, only when camera is moving
    handleCameraControlsUpdate() 
    {
        console.log("[U] handleCameraControlsUpdate invoked");
    }
    
	render() {
        this.renderer.render( this.scene, this.camera );
    }
    

    
	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------
    //resizing
	resize() {
        if (!this.renderer) return;

        window.scrollTo(0, 0.001);
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
		this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        
    }
    addListeners() {

        //----------------------------------------------------------------------
        //[1] Get click coordinates, wheel and mouseup events
        //----------------------------------------------------------------------
        this.renderer.domElement.addEventListener(
          "mousedown",
          this.handleMouseDown.bind(this),
          false
        );
        this.renderer.domElement.addEventListener(
          "wheel",
          this.handleMouseWheel.bind(this),
          false
        );
        this.renderer.domElement.addEventListener(
          "mouseup",
          this.handleMouseUp.bind(this),
          false
        );
        this.renderer.domElement.addEventListener(
          "touchstart",
          this.handleTouchStart.bind(this),
          false
        );
        this.renderer.domElement.addEventListener(
          "touchend",
          this.handleTouchEnd.bind(this),
          false
        );
        this.renderer.domElement.addEventListener(
          "touchmove",
          this.handleTouchMove.bind(this),
          false
        );

        document.addEventListener("mousemove", this.handleMouseMove.bind(this), false);
    

        //----------------------------------------------------------------------
        //[2] This is to notify, that the tab is hidden, so you can e.g. stop audio
        //----------------------------------------------------------------------
        this.isThisTabHidden = "hidden";
        this.visibilityChangeEvent = "visibilitychange";

        if (typeof document.hidden !== "undefined") {
          // Opera 12.10 and Firefox 18 and later support
          this.isThisTabHidden = "hidden";
          this.visibilityChangeEvent = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
          this.isThisTabHidden = "msHidden";
          this.visibilityChangeEvent = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
          this.isThisTabHidden = "webkitHidden";
          this.visibilityChangeEvent = "webkitvisibilitychange";
        }

        document.addEventListener(
          this.visibilityChangeEvent,
          this.handleVisibilityChange.bind(this),
          false
        );


        //----------------------------------------------------------------------
        //[3] If you need to do anything on controlsupdated
        //----------------------------------------------------------------------
        this.controls.addEventListener(
          "change",
          this.handleCameraControlsUpdate.bind(this),
          false
        );
    
        ////[4] Add UI click listeners
        //this.uiVolumeToggle.addEventListener(
        //  "click",
        //  this.toggleMute.bind(this),
        //  false
        //);
    
    }
    //mouse and touch handling
    handleMouseWheel(event) {
        if (event.deltaY < 0) {
            console.log("[U] MouseWheel down");
        } else if (event.deltaY > 0) {
            console.log("[U] MouseWheel up");
        }
        this.update();
    }
    handleMouseMove(event) {
        // this._mouse.x =  ( (event.clientX - this.renderer.domElement.offsetLeft) / this.renderer.domElement.width ) * 2 - 1;
        // this._mouse.y =  -( (event.clientY - this.renderer.domElement.offsetTop) / this.renderer.domElement.height ) * 2 + 1;
        this._clientMouse.x = event.clientX;
        this._clientMouse.y = event.clientY;
        this._mouse.x = (this._clientMouse.x / window.innerWidth) * 2 - 1;
        this._mouse.y = -(this._clientMouse.y / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this._mouse, this.camera);

        //console.log("handleMouseMove happened on" + this._mouse.x + ', '+ this._mouse.y );
        //if (this._modelsLoaded) {

        //}
    }
    handleTouchMove(event) {
        //if ( this.controls.enabled === false ) return;

        event.preventDefault(); // prevent scrolling

        switch (event.touches.length) {
            case 1:
            //rotate
            this.lastTouchX = event.touches[0].pageX;
            this.lastTouchY = event.touches[0].pageY;
            var clientX = this.lastTouchX;
            var clientY = this.lastTouchY;

            this.onMouseMove({ clientX, clientY });
            break;

            case 2:
            //mosuewheel?

            //this.dollyStartX = event.touches[0].pageX - event.touches[1].pageX;
            // this.dollyStartY = event.touches[0].pageY - event.touches[1].pageY;

            //this.lastTouchX = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
            //this.lastTouchY = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );

            break;

            default:
            this.lastTouchX = event.touches[0].pageX;
            this.lastTouchY = event.touches[0].pageY;
            var clientX = this.lastTouchX;
            var clientY = this.lastTouchY;

            this.onMouseMove({ clientX, clientY });
        }
    }
    handleMouseDown(event) {
        //[1] Register where do I click
        this._clientMouse.x = event.clientX;
        this._clientMouse.y = event.clientY;
        this._clientClicking = true;


        this._mouse.x = (this._clientMouse.x / window.innerWidth) * 2 - 1;
        this._mouse.y = -(this._clientMouse.y / window.innerHeight) * 2 + 1

        this.raycaster.setFromCamera(this._mouse, this.camera);
        console.log("[U] onMouseDown happened on" + this._mouse.x + ', '+ this._mouse.y );
    }
    handleTouchStart(event) {
        console.log("[U] onTouchStart");

        event.preventDefault(); // prevent scrolling

        switch (event.touches.length) {
            case 2:

            break;

            default:
            this.lastTouchX = event.touches[0].pageX;
            this.lastTouchY = event.touches[0].pageY;
            var clientX = this.lastTouchX;
            var clientY = this.lastTouchY;

            onMouseDown({ clientX, clientY });
        }
    }
    handleMouseUp(event) {
        var x = event.clientX;
        var y = event.clientY;
        this._clientClicking = false;

        // If the mouse moved since the mousedown then don't consider this a selection
        if (
            Math.abs(x - this._clientMouse) > 2 ||
            Math.abs(y - this._clientMouse) > 2
        )
        return;

        this._mouse.x = (this._clientMouse.x / window.innerWidth) * 2 - 1;
        this._mouse.y = -(this._clientMouse.y / window.innerHeight) * 2 + 1

        this.raycaster.setFromCamera(this._mouse, this.camera);
        console.log("[U] onMouseUp happened on" + this._mouse.x + ', '+ this._mouse.y );
    }
    handleTouchEnd(event) {
        event.preventDefault(); // prevent scrolling

        var clientX = this.lastTouchX;
        var clientY = this.lastTouchY;

        this.onMouseUp({ clientX, clientY });
    }

    //Perform action, when tab is made invisible
    handleVisibilityChange() 
    {
        //console.log(document[this.isThisTabHidden]);
        if (document[this.isThisTabHidden]) {
            console.log("[U] Viewport tab was hidden");
        } else {
            console.log("[U] Viewport tab was shown");
        }
    }

	// ---------------------------------------------------------------------------------------------
	// DEBUGGING
	// ---------------------------------------------------------------------------------------------

    toggleDebug() {
        for (var i = 0; i < this.debugObjects.length; i++) {
          this.debugObjects[i].visible = !this.debugObjects[i].visible;
        }
      }
    setBackgrounds() {
        this.scene.fog.color = this.colorBackground;
		this.scene.background = new THREE.Color( this.colorBackground);
        //this.ground.material.color = this.colorBackground;
    }
}