uniform vec3 color;
uniform sampler2D texx;

varying float fogFactor;
uniform vec3 fogColor;
//fog
//varying float scaleColor;
varying float opaNoise;

void main() {

    if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard; //make a circle without borders
    gl_FragColor = texture2D(texx, gl_PointCoord);
    gl_FragColor = vec4(color,0.7-opaNoise)*gl_FragColor;

    gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor/2.0 );
}
