export default /* glsl */`
#ifdef USE_SKINNING
    //计算法线，用于生成材质的光照效果
	mat4 skinMatrix = mat4( 0.0 );//骨骼矩阵的计算过程
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;//权重乘以对应的矩阵
	//skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix*myMatrix;
	
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	
	#ifdef USE_TANGENT
        #在我的测试中没有执行这部分代码
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;

	#endif

#endif
`;
