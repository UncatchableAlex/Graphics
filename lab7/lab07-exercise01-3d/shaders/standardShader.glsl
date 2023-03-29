
#ifdef VERTEX_SHADER
// ------------------------------------------------------//
// ----------------- VERTEX SHADER ----------------------//
// ------------------------------------------------------//

attribute vec3 a_position; // the position of each vertex

// TODO: Add uniform for model matrix
uniform mat4 u_matrixM;
// TODO: Add uniforms for view and projection matrix
uniform mat4 u_matrixP;
uniform mat4 u_matrixV;
void main() {
    // calculate new position
    vec4 pos = vec4(a_position, 1);
    // TODO: multiply pos with model matrix
    // Note: pos always has to be on the right hand side of the multiplication!
    //      e.g.: matrix * pos NOT pos * matrix. Matrix multiplication is NOT commutative.
    // TODO: multiply pos with view and projection matrix (mind correct order!)
    gl_Position = u_matrixP * u_matrixV * u_matrixM * pos;
}

#endif // (these lines seperate our vertex and fragment shader for the compiler)
#ifdef FRAGMENT_SHADER
// ------------------------------------------------------//
// ----------------- Fragment SHADER --------------------//
// ------------------------------------------------------//

precision highp float; //float precision settings

uniform vec3 u_tint;            // the tint color of this object

void main(void){

    vec3 result = u_tint.rgb;
    gl_FragColor = vec4(result, 1);
}

#endif
