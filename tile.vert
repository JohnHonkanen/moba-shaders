#version 330

layout(location = 0) in vec3 position;

uniform mat4 view;
uniform mat4 projection;
uniform mat4 model;

void main(void) {

	vec3 FragPos = vec3(model * vec4(position, 1.0));
    
	gl_Position = projection * view * vec4(FragPos, 1.0);
}