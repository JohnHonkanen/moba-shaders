#version 330

layout(location = 0) in vec3 in_Position;


uniform mat4 view;
uniform mat4 projection;
uniform mat4 model;



void main(void) {

	vec3 FragPos = vec3(model * vec4(in_Position, 1.0));
    
	gl_Position = projection * view * vec4(FragPos, 1.0);
}