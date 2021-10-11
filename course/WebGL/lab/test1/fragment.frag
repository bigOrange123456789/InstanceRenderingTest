precision lowp float;
varying vec2 outUV;
uniform sampler2D texture;
varying vec4 test;
void main(void)
{
    gl_FragColor=texture2D(texture,outUV);
    //gl_FragColor=test;
}
