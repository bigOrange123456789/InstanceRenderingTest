precision lowp float;
varying vec2 outUV;
varying vec4 color;
uniform sampler2D texture;
void main(void)
{
    gl_FragColor=color;//vec4(1.,0.,1.,1.);//color;//texture2D(texture,outUV);
    // gl_FragColor=vec4(1.,0.,1.,1.);//gl_FragColor=texture2D(texture,outUV);
    //gl_FragColor.x=1.;
}
