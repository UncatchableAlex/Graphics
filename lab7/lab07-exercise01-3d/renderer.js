"use strict";

class Renderer {

    /**
    * Creates a new instance of Renderer. The given source code will be compiled
    * and assembled into a WebGL ShaderProgram used by this shader to draw models.
    * @param {string} shaderName the source code (text) of this shader programs shader.
    */
	constructor(shaderName){
		this.program = GLUtils.createShaderProgram(shaderName);
	}

    /**
    * Draws a model using this Renderers ShaderProgram.
    * @param {ModelTransform} model the model to draw.
    * @param {Object} shaderData whatever other data the ShaderProgram needs for drawing.
    */
    drawModel(model, camera, shaderData){

        // activate this shader program
        gl.useProgram(this.program);

        // set the arrtibute arrays and uniform data for this programs vertex and
        // fragment shader based on the models buffer data and material
        this.setVertexAttributeArrays(model);
        this.setUniformData(model, camera, shaderData);

        // draw call using index based triangle assembly (elements)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.mesh.bufIndex);
        gl.drawElements(model.mesh.drawMode, model.mesh.indexCount, gl.UNSIGNED_SHORT, 0);

        return this;
	}

    /**
    * Sets ALL attributes for the vertex shader of this renderers shader program before drawing.
    * @param {ModelTransform} model the model to draw.
    */
    setVertexAttributeArrays(model){
        // position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.positionBuffer);
        let posAttribLoc = gl.getAttribLocation(this.program, "a_position");
        gl.enableVertexAttribArray(posAttribLoc);
        gl.vertexAttribPointer(posAttribLoc,3,gl.FLOAT,false,0,0);
    }

    /**
    * Sets ALL uniforms for the vertex and fragment shader of this renderers shader program before drawing.
    * @param {ModelTransform} model the model to draw, this has the model matrix and material attached.
    * @param {Object} camera the camera used for rendering, or rather its view and projection matrix.
    * @param {Object} shaderData whatever other data the Shader needs for drawing.
    */
    setUniformData(model, camera, shaderData){

        // TODO: Set matrix uniform values. Remember you are now dealing with mat4!
        //          You have to use the correct respective gl.uniformMatrix...() function for that datatype.
        let matrixMloc = gl.getUniformLocation(this.program, "u_matrixM");
        let matrixMdata = model.modelMatrix.toFloat32();
        gl.uniformMatrix4fv(matrixMloc, false, matrixMdata);
        // TODO: Set model matrix uniform (u_matrixM) data.
        // TODO: Set view matrix uniform (u_matrixV) data.
        // TODO: Set projection matrix uniform (u_matrixP) data.
        let matrixPloc = gl.getUniformLocation(this.program, "u_matrixP");
        let matrixPdata = camera.projectionMatrix.toFloat32();
        gl.uniformMatrix4fv(matrixPloc, false, matrixPdata);

        let matrixVloc = gl.getUniformLocation(this.program, "u_matrixV");
        let matrixVdata = camera.viewMatrix.toFloat32();
        gl.uniformMatrix4fv(matrixVloc, false, matrixVdata);


        // set tint color data
        let colorLoc = gl.getUniformLocation(this.program, "u_tint");
        gl.uniform3fv(colorLoc, model.material.tint.toFloat32());

    }
}
