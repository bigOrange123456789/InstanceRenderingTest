precision lowp float;

uniform mat4 proj;//投影矩阵
attribute vec3 v3Position;
attribute vec2 inUV;
varying vec2 outUV;
varying vec4 test;
void main(){
    outUV=inUV;
    gl_Position=proj*vec4(v3Position,1.0);

    //test=gl_Position/10.;

    vec3 position=v3Position;
    float size=10.;
    float pi=3.1415926;
    float x=position.x/size;
    float y=position.y/size;
    float z=position.z/size;

    float r=sqrt(x*x+y*y+z*z);
    float a1=atan(y/x);//-pi~pi     //反正切函数，返回角度值范围为 ⎡−π/2,π/2⎤

    //if(x<0&&y>0)a1=a1+0.01;
    if(x<0.&&y>0.)a1=a1+pi/2.;
    if(x<0.&&y<0.)a1=a1-pi/2.;
    float a2=acos(z/r);//o~pi       //反余切函数，输入参数范围为[-1,1]，返回[0,π]区间的角度值
    float depth=1.-r;

    gl_Position=vec4(a1,a2-pi/2.,depth/20.,1);/**/

    //gl_Position=vec4(z,y,-x/20.,1);
    //gl_Position=vec4(a1,-1.*(a2-pi/2.),1.-depth,1);
    //gl_Position=vec4(a1,-1.*(a2-pi/2.),depth,1);
    //gl_Position=vec4(a1,-1.*(a2-pi/2.),depth,1);
    //gl_Position=vec4(position.x/10.,position.y/10.,position.z/20.+0.5,1);

    test=vec4(a2/2.,1.,1.,1.);
    test=vec4(z/2.,1.,1.,1.);
    if(a2>pi*0.6)test=vec4(0.,1.,1.,1.);
    else test=vec4(1.,1.,1.,1.);
    test=vec4(a1,1.,1.,1.);
}
