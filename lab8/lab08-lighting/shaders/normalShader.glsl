
#ifdef VERTEX_SHADER
// ------------------------------------------------------//
// ----------------- VERTEX SHADER ----------------------//
// ------------------------------------------------------//

attribute vec3 a_position; // the position of each vertex
// Create new attribute a_normal
attribute vec3 a_normal;

uniform mat4 u_matrixM; // the model matrix of this object
uniform mat4 u_matrixV; // the view matrix of the camera
uniform mat4 u_matrixP; // the projection matrix of the camera

// inverse transpose to change normals into world space, this will make sure
// our normals are not stretched when the object is scaled.
uniform mat3 u_matrixInvTransM;

// TODO: create new varying v_normal
varying vec3 v_normal;
// TODO: (for specular) add new varying v_worldPos

void main() {
    // Set v_normal to have the value of a_normal. This means creating a
    // new output for the vertex shader or forwarding a value from the vertex shader
    // to the fragment shader.
    v_normal = u_matrixInvTransM * a_normal;
    // Remember to apply the Inverse Transpose matrix, to transform the normals to their
    // correct world coordinates!

    // TODO: (For specular) calculate world position

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
// TODO: create new uniform for light color
uniform vec3 u_lightcolor;
// TODO: create new uniform for light direction

// TODO: create new varying v_normal (to accept interpolated output from the vertex shader)
varying vec3 v_normal;
// TODO: (For specular) add v_worldPos varying
// TODO: (For specular) and v_viewPos uniform
// TODO: (For specular) shininess uniform

void main(void){
    // TODO: normalize normal (not normalized because of interpolation over triangle)
    // TODO: normalize light direction (not normalized by default)

    // TODO: calculate diffuse term

    // TODO: calculate specular term

    // TODO: blend surface(tint) color with light color 
    
    // TODO: apply diffuse, specular and ambient terms. Add 0.1 for ambient term.

    vec3 result = u_tint * u_lightcolor; // for now this shader uses the tint color so you can see something
    vec3 normal = normalize(v_normal);
    gl_FragColor = vec4(normal, 1);
}

#endif
