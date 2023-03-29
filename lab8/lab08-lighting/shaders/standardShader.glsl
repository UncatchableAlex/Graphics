
#ifdef VERTEX_SHADER
// ------------------------------------------------------//
// ----------------- VERTEX SHADER ----------------------//
// ------------------------------------------------------//

attribute vec3 a_position; // the position of each vertex

uniform mat4 u_matrixM; // the model matrix of this object
uniform mat4 u_matrixV; // the view matrix of the camera
uniform mat4 u_matrixP; // the projection matrix of the camera

void main() {
    // calculate new position
    gl_Position = u_matrixP * u_matrixV * u_matrixM * vec4 (a_position, 1);
}

#endif
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
