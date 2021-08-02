export default /* glsl */`
#ifdef USE_SKINNING

	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
	mat4 myMatrix =getMyMatrix(skinIndex.x );//自己创建的，用于骨骼变换的矩阵
	
    
#endif
`;
