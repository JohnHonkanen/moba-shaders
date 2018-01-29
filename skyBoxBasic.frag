#version 330

smooth in vec3 out_CubeUV;

uniform samplerCube texture0;
out vec4 FragColor;
 
void main(void) {

	FragColor = texture(texture0, out_CubeUV);
}