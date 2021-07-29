export default /* glsl */`
#ifdef USE_SKINNING
    //对于使用骨骼动画的对象调用了这部分代码
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;

	#ifdef BONE_TEXTURE
	    //输入sampler2D贴图类型的骨骼数据
		uniform highp sampler2D boneTexture;
		uniform highp sampler2D boneTexture2;//自己输入的对象
		uniform int boneTextureSize;
		//从sampler2D对象中获取所需的编号矩阵的信息
		mat4 getBoneMatrix( const in float i ) {
		    //boneTextureSize=16.0;//测试
			float j = i * 4.0;
			float x = mod( j, float( boneTextureSize ) );
			float y = floor( j / float( boneTextureSize ) );
			float dx = 1.0 / float( boneTextureSize );
			float dy = 1.0 / float( boneTextureSize );
			y = dy * ( y + 0.5 );
			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
			mat4 bone = mat4( v1, v2, v3, v4 );
			return bone;
		}
		mat4 getMyMatrix( const in float j ) {
			float x = mod( j, float( boneTextureSize ) );
			float y = floor( j / float( boneTextureSize ) );
			float dx = 1.0 / float( boneTextureSize );
			float dy = 1.0 / float( boneTextureSize );
			vec4 s = texture2D( boneTexture2, vec2( dx * ( x + 0.5 ), dy * ( y + 0.5 ) ) );
			
			mat4 myMatrix = mat4(//自己创建的，用于骨骼变换的矩阵
                vec4(s.x,0,0, 0),
                vec4(0,s.y,0, 0),
                vec4(0,0,s.z, 0),
                vec4(0,0,0, 1)
            );
            return myMatrix;
		}

	#else
    //在测试的时候这部分代码没有被使用
		uniform mat4 boneMatrices[ MAX_BONES ];

		mat4 getBoneMatrix( const in float i ) {

			mat4 bone = boneMatrices[ int(i) ];
			return bone;

		}

	#endif

#endif
`;
