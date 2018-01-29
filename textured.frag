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
	vec4 tex = texture(diffuseMap, UV);
    FragColor = tex * vec4(result, 1.0); //
}