#version 330

layout(location = 0) in vec3 in_Position;

uniform mat4 view;
uniform mat4 projection;
uniform mat4 model;

smooth out vec3 out_CubeUV;
void main(void) {

	vec4 FragPos = projection * view * model * vec4(in_Position, 1.0);

	gl_Position = FragPos;

	out_CubeUV = normalize(in_Position);
}