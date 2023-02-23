"use strict";
/**
* gl-utils
* A file containing all kinds of utility functions to work with WebGL.
* For example: Fetching the shader source code from the DOM and creating a
* shader from it.
*/
class GLUtils{
    /**
    * Looks in the html file for the script element with the given element ID.
    * @param {string} elementID ID of the script with the source text (code) of the shader.
    * @return {string} The text (code) contained in the element with elementID.
    */
    static getDomShaderSrc(elementID){
        let element = document.getElementById(elementID);
        if(!element || element.text == ""){
            console.log(elementID + " shader not found or no text."); return null;
        }
        return element.text;
    }

    /**
    * Creates and returns a ShaderProgram from the given vertex and fragment shader sources.
    * @param {string} vertexShaderScr the source text (code) of the vertex shader.
    * @param {string} fragmentShaderSrc the source text (code) of the fragment shader.
    * @return {WebGLShaderProgram} A Shaderprogram, initialized, linked and validated.
    */
    static createShaderProgram(vertexShaderScr, fragmentShaderSrc){
        // create shaders, set source code and compile them
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(vertexShader, vertexShaderScr);
        gl.shaderSource(fragmentShader, fragmentShaderSrc);
        gl.compileShader(vertexShader);
        gl.compileShader(fragmentShader);
        // check for compiler errors in vertex and fragment shader
        if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
            console.error('ERROR could not compile vertex shader.', gl.getShaderInfoLog(vertexShader));
            return -1;
        }
        if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
            console.error('ERROR could not compile fragment shader.', gl.getShaderInfoLog(fragmentShader));
            return -1;
        }
        // create shader program and attach vertex and fragment shader
        let shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);

        // Link Program, completing its preparation and uploading to the GPU
        gl.linkProgram(shaderProgram);
        if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
            console.error('ERROR linking program!', gl.getProgramInfoLog(shaderProgram));
            return -1;
        }
        // Validate that everything worked and the program is now ready to run on the GPU
        gl.validateProgram(shaderProgram);
        if(!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)){
            console.error('ERROR validating program!', gl.getProgramInfoLog(shaderProgram));
            return -1;
        }
        return shaderProgram;
    }
}
