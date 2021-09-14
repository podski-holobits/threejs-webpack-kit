
import 'three';
import { gsap } from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


export default class AssetLoader {

    constructor(app) {
        //Always define reference to the main app for this class context
        this.app = app;
        this.eventLoaded = new Event('ModelsLoaded');

        this.initLoaderManager();
        this.transitioning = false;
    }


    initLoaderManager() {
        this.loadingScreen = document.getElementById('loading-container');

        //init main loader manager
        this.manager = new THREE.LoadingManager(
            () => {
                this.onTransitionEnd();
            }

        );

        this.gltfLoader = new GLTFLoader(this.manager);
        this.audioLoader = new THREE.AudioLoader(this.manager);
        this.textureLoader = new THREE.TextureLoader(this.manager);
        this.fontloader = new THREE.FontLoader(this.manager);

        console.log('[I] AssetLoadaer Initialized');
    }

    onTransitionEnd(event) {
        if (!this.transitioning) {
            this.transitioning = true;
            this.loadingScreen.classList.add('fade-out');
            this.loadingScreen.addEventListener('transitionend', this.removeLoadingScreen.bind(this));
            app.glview.renderer.domElement.dispatchEvent(this.eventLoaded);
        }
    }

    removeLoadingScreen(event) {
        this.loadingScreen.remove();

    }


}