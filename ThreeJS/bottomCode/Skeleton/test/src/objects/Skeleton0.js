import { Bone } from './Bone.js';
import { Matrix4 } from '../math/Matrix4.js';
import { MathUtils } from '../math/MathUtils.js';

const _offsetMatrix = new Matrix4();
const _identityMatrix = new Matrix4();

function Skeleton( bones = [], boneInverses = [] ) {

	this.uuid = MathUtils.generateUUID();

	this.bones = bones.slice( 0 );
	this.boneInverses = boneInverses;
	this.boneMatrices = null;

	this.boneTexture = null;
	this.boneTextureSize = 0;

	this.frame = - 1;

	this.init();

}

Object.assign( Skeleton.prototype, {

	init: function () {

		const bones = this.bones;
		const boneInverses = this.boneInverses;

		this.boneMatrices = new Float32Array( bones.length * 16 );

		// calculate inverse bone matrices if necessary

		if ( boneInverses.length === 0 ) {

			this.calculateInverses();

		} else {

			// handle special case

			if ( bones.length !== boneInverses.length ) {

				console.warn( 'THREE.Skeleton: Number of inverse bone matrices does not match amount of bones.' );

				this.boneInverses = [];

				for ( let i = 0, il = this.bones.length; i < il; i ++ ) {

					this.boneInverses.push( new Matrix4() );

				}

			}

		}

	},

	calculateInverses: function () {

		this.boneInverses.length = 0;

		for ( let i = 0, il = this.bones.length; i < il; i ++ ) {

			const inverse = new Matrix4();

			if ( this.bones[ i ] ) {

				inverse.copy( this.bones[ i ].matrixWorld ).invert();//求矩阵的逆

			}

			this.boneInverses.push( inverse );

		}

	},

	pose: function () {

		// recover the bind-time world matrices

		for ( let i = 0, il = this.bones.length; i < il; i ++ ) {

			const bone = this.bones[ i ];

			if ( bone ) {

				bone.matrixWorld.copy( this.boneInverses[ i ] ).invert();

			}

		}

		// compute the local matrices, positions, rotations and scales

		for ( let i = 0, il = this.bones.length; i < il; i ++ ) {

			const bone = this.bones[ i ];

			if ( bone ) {

				if ( bone.parent && bone.parent.isBone ) {

					bone.matrix.copy( bone.parent.matrixWorld ).invert();
					bone.matrix.multiply( bone.matrixWorld );

				} else {

					bone.matrix.copy( bone.matrixWorld );

				}

				bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );

			}

		}

	},

	update: function () {//每一帧都会调用这个函数更新骨骼数据
		//boneInverses
		//matrix
		//matrixWorld
		//matrixWorld=‘matrix’*boneInverses
		const bones = this.bones;
		const boneInverses = this.boneInverses;
		const boneMatrices = this.boneMatrices;
		const boneTexture = this.boneTexture;

		// flatten bone matrices to array   //遍历所有bone
		console.log("bones.length",bones.length)
		for ( let i = 0, il = bones.length; i < il; i ++ ) {
			// compute the offset between the current and the original transform //计算当前变换和原始变换之间的偏移
			const matrix = bones[ i ] ? bones[ i ].matrixWorld : _identityMatrix;
			console.log( "_offsetMatrix1" , _offsetMatrix )
			//_offsetMatrix在进行矩阵相乘之前并不是单位矩阵
			_offsetMatrix.multiplyMatrices( matrix, boneInverses[ i ] );
			console.log("_offsetMatrix2",_offsetMatrix)
			/*
			if(window.skeleton){
				console.log("boneMatrices1[0]:"+window.skeleton.boneMatrices[0])
				console.log(_offsetMatrix)
			}
			*/
			_offsetMatrix.toArray( boneMatrices, i * 16 );
			//每个骨骼，每一帧的仿射变换矩阵
			/*if(window.skeleton){
				console.log("boneMatrices2[0]:"+window.skeleton.boneMatrices[0])
				if(window.skeleton.boneMatrices[0]!==0)window.skeleton=false;
			}*/

		}
		//开始测试
		/*
		if(window.skeleton){
			var sum=0;
			for(var i=0;i<window.skeleton.boneMatrices.length;i++)
				sum+=window.skeleton.boneMatrices[i]
				console.log("boneMatrices_sum:"+sum)

		}
		*/
		//完成测试
		if ( boneTexture !== null ) {

			boneTexture.needsUpdate = true;

		}


	},

	clone: function () {

		return new Skeleton( this.bones, this.boneInverses );

	},

	getBoneByName: function ( name ) {

		for ( let i = 0, il = this.bones.length; i < il; i ++ ) {

			const bone = this.bones[ i ];

			if ( bone.name === name ) {

				return bone;

			}

		}

		return undefined;

	},

	dispose: function ( ) {

		if ( this.boneTexture !== null ) {

			this.boneTexture.dispose();

			this.boneTexture = null;

		}

	},

	fromJSON: function ( json, bones ) {

		this.uuid = json.uuid;

		for ( let i = 0, l = json.bones.length; i < l; i ++ ) {

			const uuid = json.bones[ i ];
			let bone = bones[ uuid ];

			if ( bone === undefined ) {

				console.warn( 'THREE.Skeleton: No bone found with UUID:', uuid );
				bone = new Bone();

			}

			this.bones.push( bone );
			this.boneInverses.push( new Matrix4().fromArray( json.boneInverses[ i ] ) );

		}

		this.init();

		return this;

	},

	toJSON: function () {

		const data = {
			metadata: {
				version: 4.5,
				type: 'Skeleton',
				generator: 'Skeleton.toJSON'
			},
			bones: [],
			boneInverses: []
		};

		data.uuid = this.uuid;

		const bones = this.bones;
		const boneInverses = this.boneInverses;

		for ( let i = 0, l = bones.length; i < l; i ++ ) {

			const bone = bones[ i ];
			data.bones.push( bone.uuid );

			const boneInverse = boneInverses[ i ];
			data.boneInverses.push( boneInverse.toArray() );

		}

		return data;

	}

} );


export { Skeleton };
