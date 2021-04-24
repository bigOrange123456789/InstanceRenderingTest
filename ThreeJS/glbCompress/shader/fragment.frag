#define SHADER_NAME fragInstanced
precision highp float;
varying vec3 vColor;

void main()	{

    vec3 normal =vec3( 0.0, 0.0, 1.0 );
    float diffuse = dot( normal, vec3( 0.0, 0.0, 1.0 ) );
    //gl_FragColor = vec4( diffuse * vColor, 1.0 );
    gl_FragColor = vec4( 0.0, 0.0, 1.0, 1.0 );
}
