precision lowp float;
varying vec2 outUV;
uniform sampler2D texture;
varying float depth;
void main(void)
{
    gl_FragColor=texture2D(texture,outUV);
    if(depth>69.+2.*(0.465))//69~71
        gl_FragColor.w=0.;
}
