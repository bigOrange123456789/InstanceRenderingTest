#version 300 es
//使用骨骼矩阵
precision highp float;//highp
uniform sampler2D animationData;
uniform float animationDataLength;//动画数据的数据个数
uniform mat4 modelViewMatrix,projectionMatrix;
uniform float time,widthAll;//0-10000
uniform float neckPosition;

in vec3 position;
in vec2 inUV;
in vec3 normal;
in vec4 skinIndex,skinWeight;
in float speed;
in vec3 mcol0,mcol1,mcol2,mcol3;
in vec4 type;//设置贴图0-2,type[3]用处不明
in vec3 color;
in vec4 bonesWidth;//选出4个部位
in float faceShape;
//4个部位
//0躯干 0-3
//1头部 4-6
//2手臂 7-10，11-14
//3腿部 15-19-20-24

out vec2 outUV;
out vec3 varyColor,varyType;
out float type_part;//,texType;
out float outfaceShape;

void Animation_init();
mat4 Animation_computeMatrix();
float Animation_getElem2(float n);
struct Animation{
    float skeletonPos0;
    int frameIndex;
    float frameIndex_f;
    float x;
    float forward;
}oAnimation;

void main(){
    outUV = inUV;
    outfaceShape=faceShape;
    varyColor=color;
    varyType=vec3(type[0], type[1], type[2]);
    if (position.z<0.97)type_part=0.0;//下身
    else if (position.z<neckPosition) type_part=1.0;//上身
    else type_part=2.0;//头部

    Animation_init();
    /*mat4 matrix1=mat4(//确定位置//最后一列是 0 0 0 1
        vec4(1,0,0,0),
        vec4(0,1,0,0),
        vec4(0,0,1,0),
        vec4(0,0,0,1)
    );*/
    mat4 matrix1=Animation_computeMatrix();//计算动画的变换矩阵

    float d=oAnimation.x;//移动距离
    float f=oAnimation.forward;//运行方向
    mat4 matrix2 = mat4(//确定位置//最后一列是 0 0 0 1
    vec4(mcol0.x,mcol0.y,mcol0.z*f, 0),
    vec4(mcol1.x,mcol1.y,mcol1.z*f, 0),
    vec4(mcol2.x,mcol2.y,mcol2.z*f, 0),
    vec4(mcol3.x,mcol3.y,mcol3.z+d, 1)//实例化物体对象世界矩阵
    );
    gl_Position = projectionMatrix *modelViewMatrix * matrix2 * matrix1  * vec4(position, 1);
}
//尽可能按照面向对象的编程思想来编写下面的代码
struct Tool{
    int a;
}oTool;
void noShader(){
    gl_Position=vec4(0.0, 0.0, 0.0, 0.0);
}
float modFloor(float a, float b){
    return float(int(a)%int(b));
}

void Tool_init(){}


float Animation_getNumByAnim(sampler2D smp,float n){//通过矩阵序号获取动画矩阵
    //float widthAll=2.;
    float heightAll=animationDataLength/(4.*widthAll);
    float rgba=modFloor(n, 4.0);//[0,4)
    float width=modFloor( floor(n/4.0) ,widthAll);//0,1
    float height=  floor( floor(n/4.0) /widthAll);
    vec4 tttt=texture(smp, vec2(
        (0.5+width)/widthAll, //宽width
        (0.5+height)/heightAll//除3是指每个像素点可存储3个数据
    )).xyzw;
    int i=int(floor(rgba));
    return tttt[i];
}
float Animation_getElem2(float n){ //取手臂骨骼数据
    return Animation_getNumByAnim(animationData,n);
}
mat4 Animation_getMatrix(float i){ //求骨骼
    float frame_index=oAnimation.frameIndex_f;
    float startPos=i*12.+frame_index*12.*25.;//动画编号{帧序号{骨骼序号}}
    //1个动画，8帧，33根骨头  每个矩阵需要存储12个小数

    float d=oAnimation.x;//移动距离
    //float f=oAnimation.forward;//运行方向
    return mat4(//最后一列是：0 0 0 1
        Animation_getElem2(startPos+0.), Animation_getElem2(startPos+1.), Animation_getElem2(startPos+2.), 0,
        Animation_getElem2(startPos+3.), Animation_getElem2(startPos+4.), Animation_getElem2(startPos+5.), 0,
        Animation_getElem2(startPos+6.), Animation_getElem2(startPos+7.), Animation_getElem2(startPos+8.), 0,
        Animation_getElem2(startPos+9.), Animation_getElem2(startPos+10.), Animation_getElem2(startPos+11.), 1
    );
}


void Animation_frameIndexSet(float frameNum){ //求帧序号//int frame_index;
    float t=modFloor(time*speed, frameNum);//((time*speed)/16.0-floor((time*speed)/16.0))*16.0;//将time*speed对8取余结果：[0，7)
    float frameIndex_f=round(t);
    oAnimation.frameIndex  =int(frameIndex_f);
    oAnimation.frameIndex_f=round(t);
    oAnimation.x=time*speed*0.1;

    float max=9.5;//最远移动距离
    oAnimation.x=modFloor(oAnimation.x*1000.,max*2.*1000.)/1000.;
    oAnimation.forward=1.;
    if(oAnimation.x>max){
        oAnimation.x=max-(oAnimation.x-max);
        oAnimation.forward=-1.;
    }

}
mat4 Animation_computeMatrix(){
    //计算动画的变换矩阵：matrix1=skinWeight[0]*matrixs[mySkinIndex[0]]+...
    mat4 matrix1;//每个点只与一个骨骼相关
    matrix1=Animation_getMatrix(skinIndex[0]);

    return matrix1;
}
void Animation_init(){
    oAnimation.skeletonPos0=0.0;

    Animation_frameIndexSet(40.);//设置全局变量frame_index的值
}
