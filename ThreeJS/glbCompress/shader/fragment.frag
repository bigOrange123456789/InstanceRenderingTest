#define SHADER_NAME fragInstanced
precision highp float;
varying vec3 vColor;
varying vec3 vUV;
void main()	{
    float diffuse = dot( vUV, vec3( 0.0, 0.0, 1.0 ) );
    gl_FragColor = vec4( diffuse * vColor, 1.0 );
}
