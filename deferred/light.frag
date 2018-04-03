#version 330 core

struct Light {
	vec3 position;
	
	float constant;
	float linear;
	float quadratic;
	
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
};

in vec2 out_UV;

vec4 fragPosLightSpace;

layout (location = 0) out vec4 out_Color;
layout (location = 1) out vec4 out_BrightColor;

uniform sampler2D gPosition;
uniform sampler2D gNormal;
uniform sampler2D gAlbedoSpec;
uniform sampler2D gEmission;


const int MAX_LIGHTS = 80;
uniform int numDirectionals;
uniform int numPoints;

uniform Light pointLights[MAX_LIGHTS];
uniform Light directionalLight;

uniform vec3 viewPosition;

//Shadows
const int NUM_CASCADES = 3;
uniform mat4 lightSpaceMatrix[NUM_CASCADES];
vec4 LightSpacePos[NUM_CASCADES];
vec4 CascadeIndicator;
uniform float CascadeEndClipSpace[NUM_CASCADES];
uniform sampler2D shadowMaps[NUM_CASCADES];
uniform mat4 view;

uniform float near_plane;
uniform float far_plane;

vec3 calcPointLight(Light light, vec3 Normal, vec3 FragPos, vec3 viewDir, 
	vec3 Diffuse, float Specular, float Shininess);

vec3 calcDirectionalLight(Light light, vec3 Normal, vec3 FragPos, vec3 viewDir, 
	vec3 Diffuse, float Specular, float Shininess, float clipZ);

float calculateShadows(vec4 fragPosLightSpace, vec3 Normal, vec3 FragPos, vec3 lightPos, int i);

float LinearDepth(float depth);
	
void main(void) {
	
	// Retrieve information from G-Buffer
	vec3 FragPos = texture(gPosition, out_UV).rgb;
	float clipZ = texture(gPosition, out_UV).a;

	vec3 Normal = texture(gNormal, out_UV).rgb;
	vec3 Diffuse = texture(gAlbedoSpec, out_UV).rgb;
	float Specular = texture(gAlbedoSpec, out_UV).a;
	vec3 Emission = texture(gEmission, out_UV).rgb;
	float Shininess = texture(gEmission, out_UV).a;

	
	
	// Transform the world-space vertex position to light space. 
	for (int i = 0 ; i < NUM_CASCADES ; i++) {
        LightSpacePos[i] = lightSpaceMatrix[i ] * vec4(FragPos, 1.0f);
    }


	// Properties:
	vec3 viewDir = normalize(viewPosition - FragPos);
	
	vec3 result = vec3(0);
	int numLight = 0;
	//Directional Light
	result += calcDirectionalLight(directionalLight, Normal, FragPos, viewDir, Diffuse, Specular, Shininess, clipZ);


	//Point Lights
	numLight = min(numPoints, MAX_LIGHTS);
	for(int i = 0; i < numLight; i++){
		result += calcPointLight(pointLights[i], Normal, FragPos, viewDir, Diffuse, Specular, Shininess);
	}
	
	//SpotLight
	
	//Emission
	
	//Results
	//out_Color = vec4(LightSpacePos[2].xyz, 1.0);
	out_Color = vec4(result, 1.0f);
	//out_Color = LightSpacePos[0];	
}

vec3 calcPointLight(Light light, vec3 Normal, vec3 FragPos, vec3 viewDir, vec3 Diffuse, float Specular, float Shininess){

	// Normalize the resulting direction vector
	vec3 lightDir = normalize(light.position.xyz - FragPos.xyz);

	// Get the halfway vector based on the Blinn-Phong shading model 
	vec3 halfwayDir = normalize(lightDir + viewDir);

	// Diffuse
	float diff = max(dot(Normal, lightDir), 0.0f); // <--- Use max to  avoid dot product going negative when greater than 90 degree's.

	// Specular
	// Blinn-Phong specular shading 
	float spec = pow(max(dot(Normal, halfwayDir), 0.0f), Shininess);

	// Attenuation
	float Distance = length(light.position - FragPos);
	float attenuation = 1.0f / (light.constant + light.linear * Distance + light.quadratic * (Distance * Distance));

	// Combine results
	vec3 ambient = light.ambient * Diffuse;
	vec3 diffuse = light.diffuse * diff;
	vec3 specular = light.specular * spec * Specular;

	ambient *= attenuation;
	diffuse *= attenuation;
	specular *= attenuation;

	// Calculate Shadow
	//float shadow = calculateShadows(fragPosLightSpace, Normal, FragPos, light.position.xyz);
	float shadow = 1.0f;
	// Combine results
	return (ambient + diffuse + specular);
	//return (ambient + (1.0f - shadow) * (diffuse + specular)) * Diffuse;
}

vec3 calcDirectionalLight(Light light, vec3 Normal, vec3 FragPos, vec3 viewDir, vec3 Diffuse, float Specular, float Shininess, float clipZ){

	// Normalize the resulting direction vector
	vec3 lightDir = normalize(-light.position.xyz);// - FragPos.xyz);

	// Get the halfway vector based on the Blinn-Phong shading model 
	vec3 halfwayDir = normalize(lightDir + viewDir);

	// Diffuse
	float diff = max(dot(Normal, lightDir), 0.0f); // <--- Use max to  avoid dot product going negative when greater than 90 degree's.

	// Specular
	// Blinn-Phong specular shading 
	vec3 reflectDir = reflect(-light.position.xyz, Normal);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0f), Shininess);

	

	// Combine results
	vec3 ambient = light.ambient * Diffuse;
	vec3 diffuse = light.diffuse * diff;
	vec3 specular = light.specular * spec * 0.001;


	// Calculate Shadow
	

	CascadeIndicator = vec4(0.0, 0.0, 0.0, 0.0);
	float shadow = 1.0;

	//shadow = calculateShadows(LightSpacePos[1], Normal, FragPos, light.position.xyz, 1);
	shadow = calculateShadows(LightSpacePos[0], Normal, FragPos, light.position.xyz, 0);
	shadow += calculateShadows(LightSpacePos[1], Normal, FragPos, light.position.xyz, 1);
	shadow += calculateShadows(LightSpacePos[2], Normal, FragPos, light.position.xyz, 2);
    for (int i = 0 ; i < NUM_CASCADES ; i++) {
        if (clipZ <= CascadeEndClipSpace[i]) {
        	//shadow = calculateShadows(LightSpacePos[i], Normal, FragPos, light.position.xyz, i);
            if (i == 0)
                CascadeIndicator = vec4(0.1, 0.0, 0.0, 0.0);
            else if (i == 1)
                CascadeIndicator = vec4(0.0, 0.1, 0.0, 0.0);
            else if (i == 2)
                CascadeIndicator = vec4(0.0, 0.0, 0.1, 0.0);

            break;
        }
   }

   shadow = min(0.5, shadow);
	//float shadow = 1.0f;
	// Combine results
	//return (ambient + diffuse +specular);
	return (ambient + (1.0f - shadow) * (diffuse + specular)) * Diffuse;
}

float calculateShadows(vec4 fragPosLightSpace, vec3 Normal, vec3 FragPos, vec3 lightPos, int i){
	// perspecitve divide to transform the NDC coordinates to the range of [0,1]
	vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;

	// transform to [0,1] range
	projCoords = projCoords * 0.5 + 0.5;

	float shadow = 0.0;

	vec3 normal = normalize(Normal);
	vec3 lightDir = normalize(-lightPos);// - FragPos.xyz);
	float bias = 0;

	float currentDepth = projCoords.z;
	float closestDepth = texture(shadowMaps[i], projCoords.xy).r;
	vec2 texelSize = 1.0f / textureSize(shadowMaps[i], 0);

	for(int x = -1; x <= 1; ++x){
		for(int y = -1; y <= 1; ++y){
			float pcfDepth = texture(shadowMaps[i], projCoords.xy + vec2(x, y) * texelSize).r; 
			shadow += currentDepth - bias > pcfDepth ? 1.0f : 0.0f;
		}
	}

	shadow /= 9.0f;

	if(projCoords.z > 1.0f || projCoords.z <= 0.0f
		|| projCoords.x > 1.0f || projCoords.x <= 0.0f
		|| projCoords.y > 1.0f || projCoords.y <= 0.0f
		){
		shadow = 0.0f;
	}

	return shadow;
}

float LinearDepth(float depth){
	float z = depth * 2.0f - 1.0f; 
	
	return (2.0f * near_plane * far_plane) / (far_plane + near_plane - z * (far_plane - near_plane));
}
