#version 330 core

layout (location = 0) out vec4 gPosition; 
layout (location = 1) out vec3 gNormal; 
layout (location = 2) out vec4 gAlbedoSpec; 
layout (location = 3) out vec4 gEmission;

in vec3 FragPos;
in float clipZ;
in vec3 out_Normal;  
in vec2 out_UV;
in mat3 out_TBN;


uniform sampler2D diffuseMap; 
uniform sampler2D specularMap;
uniform sampler2D normalMap;
uniform sampler2D emissionMap;
uniform sampler2D hdrBuffer;
 
void main(void) {

	gPosition.rgb = FragPos;
	gPosition.a = clipZ;
    //gNormal = out_Normal; 

	// Store diffuse per-fragment color.
    gAlbedoSpec.rgb = texture(diffuseMap, out_UV).rgb;

	// Store specular intesity in AlbedoMap's alpha component
	gAlbedoSpec.a = texture(specularMap, out_UV).a;

	// We obtain the normal from the normal map in a range [0, 1]
	// Then tranform normal vector to range [-1 , 1]. Note: This normal is in the world space (Don't multiply with out_TBN if you want to keep in tangent space).
	vec3 normal =  out_Normal;//out_TBN * (texture(normalMap, out_UV).rgb * 2.0f - vec3(1.0f, 1.0f, 1.0f));

	// 2nd normal strategy
	//vec3 bumpMap = texture(normalMap, out_UV).rgb;
	//vec3 normal = 2.0f * bumpMap - vec3(1.0f, 1.0f, 1.0f);
	//normal = out_TBN * normal;

	// Store the per-fragment normals into the gbuffer
	gNormal = normalize(normal); 

	// Deprecated gNormal implementation
	//vec3 normal = texture(normalMap, out_UV).rgb;
	//gNormal = normal; 

	// Emissive/Glow
	gEmission.rgb = texture(emissionMap, out_UV).rgb;
	gEmission.a = 32.0f;
}