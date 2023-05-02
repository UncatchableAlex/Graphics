#ifdef VERTEX_SHADER
// ------------------------------------------------------//
// ----------------- VERTEX SHADER ----------------------//
// ------------------------------------------------------//

attribute vec3 a_position; // the position of each vertex
// Create new attribute a_normal
attribute vec3 a_normal;
attribute vec2 a_texcoord;


uniform mat4 u_matrixM; // the model matrix of this object
uniform mat4 u_matrixV; // the view matrix of the camera
uniform mat4 u_matrixP; // the projection matrix of the camera

// inverse transpose to change normals into world space, this will make sure
// our normals are not stretched when the object is scaled.
uniform mat4 u_matrixInvTransM;

// create new varying v_normal
varying vec3 v_normal;
// (for specular) add new varying v_worldPos
varying vec3 v_worldpos;
// create a texture varying to get the texture coordinates to the fragment shader:
varying vec2 v_texcoord;
void main() {
    // Set v_normal to have the value of a_normal. This means creating a
    // new output for the vertex shader or forwarding a value from the vertex shader
    // to the fragment shader.
    v_normal = mat3(u_matrixInvTransM) * a_normal;

    v_texcoord = a_texcoord;

    // (For specular) calculate world position
    v_worldpos = (u_matrixM * vec4(a_position, 1)).xyz;
    // calculate new position
    gl_Position = u_matrixP * u_matrixV * u_matrixM * vec4(a_position, 1);
    //gl_Position = vec4(a_position, 1);
}

#endif
#ifdef FRAGMENT_SHADER
// ------------------------------------------------------//
// ----------------- Fragment SHADER --------------------//
// ------------------------------------------------------//

precision highp float; //float precision settings

uniform vec3 u_tint;            // the tint color of this object
// create new uniform for light color
uniform vec3 u_lightcolor;
// create new uniform for light position
uniform vec3 u_lightposition;
// (For specular) and u_viewPos uniform
uniform vec3 u_viewpos;
// (For specular) shininess uniform
uniform float u_shininess;
// create new varying v_normal (to accept interpolated output from the vertex shader)
varying vec3 v_normal;
// (For specular) add v_worldPos varying
varying vec3 v_worldpos;
// add a texture coordinate varying to get the texture coordinates from the vertex shader:
varying vec2 v_texcoord;
// add a sampler for our texture
uniform sampler2D u_mainTex;
void main(void){
    // implement attenuation:
    float constant = 1.0;
    float linear = 0.09;
    float quadratic = 0.032;
    float dist = distance(v_worldpos, u_lightposition);
    float attenuation = 1.0 / (constant + (linear * dist) + (quadratic * dist * dist));

    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(v_worldpos - u_lightposition);
    float diffuse = max(dot(-lightDir, normal), 0.0);
    float ambient = 0.3;
    vec3 v = normalize(u_viewpos - v_worldpos);
    vec3 h = normalize(-lightDir + v);
    float specular = pow(max(dot(h, normal), 0.0), u_shininess);
    // get the texture color:
    vec3 texColor = texture2D(u_mainTex, v_texcoord).rbg;
    vec3 baseColor = texColor * u_tint;
    vec3 result = baseColor * u_lightcolor * (diffuse + ambient + specular) * attenuation;
    gl_FragColor = vec4(result, 1);
}

#endif
