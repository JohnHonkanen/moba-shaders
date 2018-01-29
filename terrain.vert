#version 330

layout(location = 0) in vec3 in_Position;
layout(location = 1) in vec2 in_UV;
layout(location = 2) in vec3 in_Normal;

uniform mat4 view;
uniform mat4 projection;
uniform mat4 model;

out vec3 out_Normal;
out vec2 out_UV;

void main(void) {

	vec3 FragPos = vec3(model * vec4(in_Position, 1.0));
    
	out_Normal = in_Normal;
	out_UV = in_UV;

	gl_Position = projection * view * vec4(FragPos, 1.0);
}