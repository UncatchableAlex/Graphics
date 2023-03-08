// NOTE: I DID THE EXTRA CREDIT
#ifdef VERTEX_SHADER
// ------------------------------------------------------//
// ----------------- VERTEX SHADER ----------------------//
// ------------------------------------------------------//

attribute vec2 a_position; // the position of each vertex
uniform mat3 u_matrixM; // the model matrix of this object
uniform float u_Time; // the current time
uniform float u_Lowest; // the lowest point of the model

void main() {
    vec3 pos = vec3(a_position, 1); // z is 1 for 3x3 matrix transformations.
    pos[0] += sin(u_Time + pos[1]) * 0.6 * (0.1 + pos[1] - u_Lowest);
    vec4 transpos = vec4 (u_matrixM * pos, 1);
    gl_Position = transpos;
}

#endif
#ifdef FRAGMENT_SHADER
// ------------------------------------------------------//
// ----------------- Fragment SHADER --------------------//
// ------------------------------------------------------//

precision highp float; //float precision settings
uniform vec3 u_tint; // the tint color of this object

void main()
{
    gl_FragColor = vec4(u_tint,1);
}

#endif
