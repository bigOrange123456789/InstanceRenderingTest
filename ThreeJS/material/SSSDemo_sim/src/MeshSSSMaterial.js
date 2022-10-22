import { ShaderMaterial }  from 'https://cdn.skypack.dev/three@0.134.0/src/materials/ShaderMaterial.js';

import { ShaderLib } from 'https://cdn.skypack.dev/three@0.134.0/src/renderers/shaders/ShaderLib.js';

import { TangentSpaceNormalMap } from 'https://cdn.skypack.dev/three@0.134.0/src/constants.js';
import { Vector2 } from 'https://cdn.skypack.dev/three@0.134.0/src/math/Vector2.js';
import { Color } from 'https://cdn.skypack.dev/three@0.134.0/src/math/Color.js';


class MeshSSSMaterial extends ShaderMaterial {

    constructor( parameters ) {
        super();

        this.defines = {  };


        this.type = 'MeshSSSMaterial';

        /************************ From StandardMaterial ***************************/

		this.color = new Color( 0xffffff ); // diffuse
		this.roughness = 1.0;
		this.metalness = 0.0;

		this.map = null;

		this.lightMap = null;
		this.lightMapIntensity = 1.0;

		this.aoMap = null;
		this.aoMapIntensity = 1.0;

		this.emissive = new Color( 0x000000 );
		this.emissiveIntensity = 1.0;
		this.emissiveMap = null;

		this.bumpMap = null;
		this.bumpScale = 1;

		this.normalMap = null;
		this.normalMapType = TangentSpaceNormalMap;
		this.normalScale = new Vector2( 1, 1 );

		this.displacementMap = null;
		this.displacementScale = 1;
		this.displacementBias = 0;

		this.roughnessMap = null;

		this.metalnessMap = null;

		this.alphaMap = null;

		this.envMap = null;
		this.envMapIntensity = 1.0;

		this.refractionRatio = 0.98;

		this.wireframe = false;
		this.wireframeLinewidth = 1;
		this.wireframeLinecap = 'round';
		this.wireframeLinejoin = 'round';

		this.flatShading = false;

        /***********************************************************************/


		this.setValues( parameters );
        

        this.uniforms =  Object.assign( {} , ShaderLib.standard.uniforms , this.uniforms);

    }

	copy( source ) {

		super.copy( source );

		this.defines = {  };
		this.uniforms =  {};
		for(var key in source.uniforms){
			if(source.uniforms[key].value instanceof Color){
				this.uniforms[key] = {
					value:new Color(source.uniforms[key].value)
				};
			}
			else{
				this.uniforms[key] = {
					value:source.uniforms[key].value
				};
			}

		}

		this.color.copy( source.color );
		this.roughness = source.roughness;
		this.metalness = source.metalness;

		this.map = source.map;

		this.lightMap = source.lightMap;
		this.lightMapIntensity = source.lightMapIntensity;

		this.aoMap = source.aoMap;
		this.aoMapIntensity = source.aoMapIntensity;

		this.emissive.copy( source.emissive );
		this.emissiveMap = source.emissiveMap;
		this.emissiveIntensity = source.emissiveIntensity;

		this.bumpMap = source.bumpMap;
		this.bumpScale = source.bumpScale;

		this.normalMap = source.normalMap;
		this.normalMapType = source.normalMapType;
		this.normalScale.copy( source.normalScale );

		this.displacementMap = source.displacementMap;
		this.displacementScale = source.displacementScale;
		this.displacementBias = source.displacementBias;

		this.roughnessMap = source.roughnessMap;

		this.metalnessMap = source.metalnessMap;

		this.alphaMap = source.alphaMap;

		this.envMap = source.envMap;
		this.envMapIntensity = source.envMapIntensity;

		this.refractionRatio = source.refractionRatio;

		this.wireframe = source.wireframe;
		this.wireframeLinewidth = source.wireframeLinewidth;
		this.wireframeLinecap = source.wireframeLinecap;
		this.wireframeLinejoin = source.wireframeLinejoin;

		this.flatShading = source.flatShading;

        

		return this;

	}

}

MeshSSSMaterial.prototype.isMeshStandardMaterial = true;

export { MeshSSSMaterial };
