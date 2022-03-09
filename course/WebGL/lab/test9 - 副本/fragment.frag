precision lowp float;
varying vec2 outUV;
uniform sampler2D texture;
void main(void)
{
    gl_FragColor=texture2D(texture,outUV);
}
