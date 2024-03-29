#version 330 core
layout (location = 0) in vec3 in_Position;
layout (location = 1) in vec2 in_UV;

out vec2 out_UV;

uniform mat4 model;

void main()
{
    out_UV = in_UV;
    gl_Position = model * vec4(in_Position, 1.0);
}