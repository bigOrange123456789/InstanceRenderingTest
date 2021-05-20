#define SHADER_NAME fragInstanced
precision highp float;
varying vec3 vColor;
//varying vec3 vNormal;
void main()	{
    //float diffuse1 = dot( vNormal, vec3( 0.0, 1.0, 1.0 ) );
    //float diffuse2 = dot( vNormal, vec3( 0.0, -1.0, -1.0 ) );
    gl_FragColor = vec4( vColor, 1.0 );
    //gl_FragColor = vec4( (abs(diffuse1)+abs(diffuse2)) * vColor, 1.0 );
}
