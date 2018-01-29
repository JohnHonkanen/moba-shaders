// textured.frag
#version 330

out vec4 FragColor;

uniform sampler2D texture0;

in vec2 UV;
 
void main(void) {
	vec4 texture = texture(texture0,UV);

	
	if(texture.a<0.5)
	{
		discard;
	}

	FragColor = texture;
}