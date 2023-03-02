
#ifdef VERTEX_SHADER
// ------------------------------------------------------//
// ----------------- VERTEX SHADER ----------------------//
// ------------------------------------------------------//

attribute vec2 a_position; // the position of each vertex
uniform mat3 u_matrixM; // the model matrix of this object

void main() {
    vec3 pos = vec3(a_position, 1); // z is 1 for 3x3 matrix transformations.
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
