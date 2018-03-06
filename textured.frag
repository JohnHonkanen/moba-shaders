// textured.frag
#version 330

out vec4 FragColor;

uniform sampler2D diffuseMap;

in vec2 UV;

in vec3 Normal;  
in vec3 FragPos;

uniform vec3 lightPos; 
uniform vec3 lightColor;
uniform vec3 objectColor;
 
void main(void) {
    // ambient
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColor;
  	
    // diffuse 
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;
            
    vec3 result = (ambient + diffuse);
	

	vec4 final_color = vec4(result, 1.0);
	
	vec4 tex0 = texture(diffuseMap, UV);
	vec4 tex1 = texture(secondaryTexture, UV);

    FragColor = mix(tex1,tex0, step(FragPos.y, partialRenderV)); //

}