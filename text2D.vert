// textured.vert
// use textures, but no lighting
#version 330

layout(location = 0) in vec3 position;
layout(location = 1) in vec2 uv;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec2 UV;

// multiply each vertex position by the MVP matrix
void main(void) {

	vec3 FragPos = vec3(model * vec4(position, 1.0));
	UV = uv;
    
    //gl_Position = vec4(FragPos, 1.0);
	//gl_Position = projection * view * vec4(FragPos, 1.0);
	gl_Position = projection * vec4(FragPos, 1.0);
}