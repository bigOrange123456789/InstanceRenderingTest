precision lowp float;

uniform mat4 proj,view,model;//投影矩阵
attribute vec3 v3Position;
attribute vec2 inUV;
varying vec2 outUV;

void main(){
    outUV=inUV;
    gl_Position=proj*view*model*vec4(v3Position,1.0);
}
