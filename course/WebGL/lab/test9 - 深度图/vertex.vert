// precision lowp float;

uniform mat4 proj,view,model;//投影矩阵
attribute vec3 v3Position;
attribute vec2 inUV;
varying vec2 outUV;
varying vec4 color;
void main(){
    // outUV=inUV;

    // color=vec4(1.,0.,1.,1.);
    gl_Position=proj*view*model*vec4(v3Position,1.0);
    // float depth=1.+gl_Position[2]/gl_Position[3]
    int a=1;

    //depth:0~far //far=100
    float far=100.;
    // int depth=int(256.*256.*256.*gl_Position[2]/far)
    float r= 100.*gl_Position[2]/far;
    float g= 100.*(r-floor(r));
    float b= 100.*(g-floor(g));
    //depth=r*0.001+g*0.001*0.001+b*0.001*0.001*0.001

    color=vec4(
        r/255.,g/255.,b/255.,
        1.);
    //gl_Position.z/gl_Position.w
}
