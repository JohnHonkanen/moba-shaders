// textured.vert
// use textures, but no lighting
#version 330

layout(location = 0) in vec3 position;
layout(location = 2) in vec2 uv;
layout(location = 3) in vec3 normal;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec3 FragPos;
out vec3 Normal;

in  vec3 in_Position;

out vec2 UV;

// multiply each vertex position by the MVP matrix
void main(void) {

	FragPos = vec3(model * vec4(position, 1.0));
	UV = uv;
	Normal = normal; 
    
    gl_Position = projection * view * vec4(FragPos, 1.0);
}