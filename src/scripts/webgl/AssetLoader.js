
import 'three';
import { GLTFLoader } from 'three-examples/loaders/GLTFLoader';


export default class AssetLoader {

    constructor(app) {
        //Always define reference to the main app for this class context
        this.app = app;
        
        this.initLoaderManager();
    }
    

    initLoaderManager()
    {
        //GLTF VIEWER HELPER: https://gltf-viewer.donmccurdy.com/

        //init main loader manager
        this.manager = new THREE.LoadingManager(
            () => {
	
                const loadingScreen = document.getElementById( 'loading-container' );
                loadingScreen.classList.add( 'fade-out' );
                
                // optional: remove loader from DOM via event listener
                loadingScreen.addEventListener( 'transitionend',  this.onTransitionEnd.bind(this));
                
            }

        );
        //init gltfloader
        this.gltfLoader = new GLTFLoader( this.manager);
        console.log( 'AssetLoadaer Initialized' );
    }
/*
    onStart( url, itemsLoaded, itemsTotal )
    {
        console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    }

    onProgress( url, itemsLoaded, itemsTotal )
    {
        console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

    }

    onError()
    {

    }


    onCompleted()
    {
        console.log( 'Loading complete!');
    }
*/

    onTransitionEnd( event ) {

        event.target.remove();
        console.log( 'Removing loadin screen' );
        
    }

}