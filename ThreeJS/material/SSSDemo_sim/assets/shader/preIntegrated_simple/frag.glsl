#define STANDARD

#ifdef PHYSICAL
	#define IOR
	#define SPECULAR
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

uniform float brightness_specular;

uniform sampler2D sssLUT;
uniform float sssIntensity;
uniform float CurveFactor;

#ifdef IOR
	uniform float ior;
#endif

#ifdef SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularTint;

	#ifdef USE_SPECULARINTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif

	#ifdef USE_SPECULARTINTMAP
		uniform sampler2D specularTintMap;
	#endif
#endif

#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif

#ifdef USE_SHEEN
	uniform vec3 sheenTint;
	uniform float sheenRoughness;
#endif

varying vec3 vViewPosition;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>

/*********************************** Custom RenderEquations ***********************************/

	struct PhysicalMaterial {

		vec3 diffuseColor;
		float roughness;
		vec3 specularColor;
		float specularF90;

		#ifdef USE_CLEARCOAT
			float clearcoat;
			float clearcoatRoughness;
			vec3 clearcoatF0;
			float clearcoatF90;
		#endif

		#ifdef USE_SHEEN
			vec3 sheenTint;
			float sheenRoughness;
		#endif

	};

	// temporary
	vec3 clearcoatSpecular = vec3( 0.0 );
	float curve = 1.0;


	// Analytical approximation of the DFG LUT, one half of the
	// split-sum approximation used in indirect specular lighting.
	// via 'environmentBRDF' from "Physically Based Shading on Mobile"
	// https://www.unrealengine.com/blog/physically-based-shading-on-mobile
	vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {

		float dotNV = saturate( dot( normal, viewDir ) );

		const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );

		const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );

		vec4 r = roughness * c0 + c1;

		float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;

		vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;

		return fab;

	}

	vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {

		vec2 fab = DFGApprox( normal, viewDir, roughness );

		return specularColor * fab.x + specularF90 * fab.y;

	}

	// Fdez-Agüera's "Multiple-Scattering Microfacet Model for Real-Time Image Based Lighting"
	// Approximates multiscattering in order to preserve energy.
	// http://www.jcgt.org/published/0008/01/03/
	void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {

		vec2 fab = DFGApprox( normal, viewDir, roughness );

		vec3 FssEss = specularColor * fab.x + specularF90 * fab.y;

		float Ess = fab.x + fab.y;
		float Ems = 1.0 - Ess;

		vec3 Favg = specularColor + ( 1.0 - specularColor ) * 0.047619; // 1/21
		vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );

		singleScatter += FssEss;
		multiScatter += Fms * Ems;

	}

	#if NUM_RECT_AREA_LIGHTS > 0

		void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {

			vec3 normal = geometry.normal;
			vec3 viewDir = geometry.viewDir;
			vec3 position = geometry.position;
			vec3 lightPos = rectAreaLight.position;
			vec3 halfWidth = rectAreaLight.halfWidth;
			vec3 halfHeight = rectAreaLight.halfHeight;
			vec3 lightColor = rectAreaLight.color;
			float roughness = material.roughness;

			vec3 rectCoords[ 4 ];
			rectCoords[ 0 ] = lightPos + halfWidth - halfHeight; // counterclockwise; light shines in local neg z direction
			rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
			rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
			rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;

			vec2 uv = LTC_Uv( normal, viewDir, roughness );

			vec4 t1 = texture2D( ltc_1, uv );
			vec4 t2 = texture2D( ltc_2, uv );

			mat3 mInv = mat3(
				vec3( t1.x, 0, t1.y ),
				vec3(    0, 1,    0 ),
				vec3( t1.z, 0, t1.w )
			);

			// LTC Fresnel Approximation by Stephen Hill
			// http://blog.selfshadow.com/publications/s2016-advances/s2016_ltc_fresnel.pdf
			vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );

			reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );

			reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );

		}

	#endif

	float PHBeckmann( float NdotH , float roughness ){
		roughness = max(roughness,0.01);
        float alpha = acos( NdotH );
        float ta = tan(alpha);
        float m = roughness * roughness ;
        float val = 1.0 / ( m * pow(NdotH,4.0) ) * exp( -(ta*ta)/ m );
        return val;
    }

    float fresnelReflectance( vec3 H, vec3 V, float F0 )
    {
        float base = 1.0 - dot( V, H );
        float exponential = pow( base, 5.0 );
        return exponential + F0 * ( 1.0 - exponential );
    }


	void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {

        float dotNL = dot( geometry.normal, directLight.direction );

        // Kelemen/Szirmay-Kalos Specular
        // https://developer.nvidia.com/gpugems/gpugems3/part-iii-rendering/chapter-14-advanced-techniques-realistic-real-time-skin
        if(dotNL > 0.0){

            vec3 h =  directLight.direction + geometry.viewDir ; // Unnormalized half-way vector 
            vec3 H = normalize( h ); 
            float dotNH = dot( geometry.normal , H );
            float PH = PHBeckmann( dotNH , roughness );
            float F = fresnelReflectance( H,geometry.viewDir,0.028 );
            float frSpec = max( PH * F / dot(h,h) , 0.0 );
            reflectedLight.directSpecular +=  dotNL * brightness_specular * frSpec * directLight.color ;

        }

        dotNL = saturate( dotNL );

		vec3 irradiance = dotNL * directLight.color;

		#ifdef USE_CLEARCOAT

			float dotNLcc = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );

			vec3 ccIrradiance = dotNLcc * directLight.color;

			clearcoatSpecular += ccIrradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.clearcoatNormal, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );

		#endif

		#ifdef USE_SHEEN

			reflectedLight.directSpecular += irradiance * BRDF_Sheen( directLight.direction, geometry.viewDir, geometry.normal, material.sheenTint, material.sheenRoughness );

		#endif


		reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

		//Subsurface Scattering
        float wrappedDotNL = (dot(directLight.direction, geometry.normal) * 0.5 + 0.5);
        vec4 scatteringColor = texture2D(sssLUT, vec2(wrappedDotNL, 1.0 / curve  ));


        reflectedLight.directDiffuse += (1.0 - wrappedDotNL) * directLight.color * material.diffuseColor * scatteringColor.rgb * sssIntensity;
	}

	void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {

		reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

	}

	void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {

		#ifdef USE_CLEARCOAT

			clearcoatSpecular += clearcoatRadiance * EnvironmentBRDF( geometry.clearcoatNormal, geometry.viewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );

		#endif

		// Both indirect specular and indirect diffuse light accumulate here

		vec3 singleScattering = vec3( 0.0 );
		vec3 multiScattering = vec3( 0.0 );
		vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;

		computeMultiscattering( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );

		vec3 diffuse = material.diffuseColor * ( 1.0 - ( singleScattering + multiScattering ) );

		reflectedLight.indirectSpecular += radiance * singleScattering;
		reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;

		reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;

	}

	#define RE_Direct				RE_Direct_Physical
	#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
	#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
	#define RE_IndirectSpecular		RE_IndirectSpecular_Physical

	// ref: https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf



/*********************************** Custom RenderEquations ***********************************/

#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	// SSS
    curve = length( fwidth( vNormal ) ) / (length( fwidth( vViewPosition  ) ) * CurveFactor );

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

	#include <transmission_fragment>

	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	// vec3 outgoingLight = reflectedLight.directSpecular ;

	#ifdef USE_CLEARCOAT

		float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );

		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );

		outgoingLight = outgoingLight * ( 1.0 - clearcoat * Fcc ) + clearcoatSpecular * clearcoat;

	#endif

	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}