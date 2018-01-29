#version 330

out vec4 FragColor;
in vec3 out_Normal;
in vec2 out_UV;

uniform sampler2D texture0;

void main(void) {

	FragColor = texture(texture0, out_UV);
}