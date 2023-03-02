"use strict";

class Renderer{

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
    drawModel(model, shaderData){

        // activate this shader program
        gl.useProgram(this.program);

        // set the arrtibute arrays and uniform data for this programs vertex and
        // fragment shader based on the models buffer data and material
        this.setVertexAttributeArrays(model);
        this.setUniformData(model, shaderData);

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
        let attribLocation = gl.getAttribLocation(this.program, "a_position");
        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.positionBuffer);
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, 2, gl.FLOAT, false, 0, 0);

        // TODO: Set up the pointer of buffer and position vertex attribute
        // Hint: Remember all the steps required!
            // 1. Bind buffer
            // 2. Enable the Vertex Attribute Array
            // 3. Set the Vertex Attribute Pointer
        // Hint: The buffer is stored with the mesh: model.mesh.positionBuffer (see common/primitives.js)
        // Hint: The name for the position attribute is found in the vertex shader ( see shaders/standardShader.glsl)
        // Hint: The shader program is stored in this class: this.program

    }

    /**
    * Sets ALL uniforms for the vertex and fragment shader of this renderers shader program before drawing.
    * @param {ModelTransform} model the model to draw.
    * @param {Object} shaderData whatever other data the Shader needs for drawing.
    */
    setUniformData(model, shaderData){
        let mMatLoc = gl.getUniformLocation(this.program, "u_matrixM");
        let mMatData = new Float32Array(model.modelMatrix);
        gl.uniformMatrix3fv(mMatLoc, false, mMatData)
        // TODO: set uniform data for model matrix
        // Hint: The shader program is stored in this class: this.program
        // Hint: The name for the uniform is found in shaders/standardShader.glsl
        // Hint: The model matrix is stored at model.modelMatrix  (see modeltransform.js)
        let tintLoc = gl.getUniformLocation(this.program, "u_tint");
        let tintData = new Float32Array(model.material.tint);
        gl.uniform3fv(tintLoc, tintData);
        // TODO: set uniform data for tint-color
        // Hint: The shader program is stored in this class: this.program
        // Hint: The name for the uniform is found in shaders/standardShader.glsl
        // Hint: The tint color is part of the models material (model.material),
        // which is set in engine2D.html. It is a V3.
    }
}
