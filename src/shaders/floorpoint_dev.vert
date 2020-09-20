//-------------------------------------------------------------------
///UNIFORMS
//-------------------------------------------------------------------

//point size definition
uniform float pointSize;// = 1.0;
uniform float pointSize_min;// = 0.8;

//fbm2d scale
uniform float simplex_scale;// = 40.0;
uniform float fbm2d_scale;// = 40.0;
uniform int fbm2d_octaves;// = 6;

//initial noise scale
uniform float point_loc_noise;// = 1.0;
uniform float opacity_noise;// = 0.5;

//noise movement
uniform float noise_mov_offset;//100.0
uniform float noise_mov_decay;//2
uniform float noise_mov_decay_min;//0.01

uniform float noise_elevation; //30.0
uniform float noise_elevation_min; //0.2
uniform float noise_elevation_offset; //1.0
//movementdecat
//movement elevation
//moement elevation b

uniform float frequency;// = 1.0;

uniform float fogDensity;


uniform float time;
//Varying passed to fragment shader
varying float fogFactor;
varying float opaNoise;


#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: fbm2d = require('glsl-fractal-brownian-noise/2d') 

void main() {

    //Define
        float sxn = snoise3(position*simplex_scale);
    //Main position
        vec4 mvPosition = modelViewMatrix * vec4( position + sxn*point_loc_noise, 1.0 ); 
    
    //Opacity noise
        opaNoise = sxn * opacity_noise;

    //Calculate fog
        float depth = mvPosition.z;
        const float LOG2 = 1.442695;
        fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
        fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );

    //Calculate movement decay

        float movementDecay_a = (noise_mov_decay_min+pow(fogFactor*fogFactor,noise_mov_decay));
        float movementElevation_a = (noise_elevation_min+pow(fogFactor*fogFactor,noise_mov_decay)*noise_elevation);
        float movementElevation_b = noise_elevation_offset*fogFactor;

    //Modify position for floating position
        mvPosition.x = mvPosition.x + movementDecay_a*sin((2.0)*frequency*time + noise_mov_offset*sxn);
        mvPosition.z = mvPosition.z + movementDecay_a*sin((4.0)*frequency*time + noise_mov_offset*sxn);
        mvPosition.y = mvPosition.y + movementDecay_a*sin((3.0)*frequency*time + noise_mov_offset*sxn);

        mvPosition.y = mvPosition.y + movementElevation_a*pow(fbm2d(position.xz/fbm2d_scale, fbm2d_octaves),2.0) + movementElevation_b;


    //Modify size of the point
        gl_PointSize = pointSize*clamp( 10.0 / - mvPosition.z,pointSize_min,10.0);
        
    //Adjust to proper projection matrix
        gl_Position = projectionMatrix * mvPosition;

}