"use strict";

class DirLightRenderer{

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

    setVertexAttributeArrays(model){
        // position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.positionBuffer);
        let posAttribLoc = gl.getAttribLocation(this.program, "a_position");
        gl.enableVertexAttribArray(posAttribLoc);
        gl.vertexAttribPointer(posAttribLoc,3,gl.FLOAT,false,0,0);

        // add normal attribute (bind normal buffer, enable attribute array and setup attribute pointer)
        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.normalBuffer);
        let normalAttribLoc = gl.getAttribLocation(this.program, "a_normal");
        gl.enableVertexAttribArray(normalAttribLoc);
        gl.vertexAttribPointer(normalAttribLoc,3,gl.FLOAT,false,0,0);

        let matrixInvTransMLoc = gl.getUniformLocation(this.program, "u_matrixInvTransM");
        let matrixInvTransMData = M4.inverseTranspose3x3(model.modelMatrix);
        gl.uniformMatrix3fv(matrixInvTransMLoc, false, matrixInvTransMData.toFloat32());

    }

    /**
    * Sets ALL uniforms for the vertex and fragment shader of this renderers shader program before drawing.
    * @param {ModelTransform} model the model to draw.
    * @param {Object} shaderData whatever other data the Shader needs for drawing.
    */
    setUniformData(model, camera, shaderData){
        // make some local variables for the lighting data to avoid spaghetti code
        let lightDirection = shaderData.lightingData.lightDirection;
        let lightColor = shaderData.lightingData.lightColor;

        // TODO: set uniform data for directional lighting
        let lightColorLocation = gl.getUniformLocation(this.program, "u_lightcolor");
        gl.uniform3fv(lightColorLocation, lightColor.toFloat32());
        // TODO: set data for inverse transpose 3x3 matrix uniform
        let lightDirLoc = gl.getUniformLocation(this.program, "u_lightdirection");
        gl.uniform3fv(lightDirLoc, lightDirection.toFloat32());

        // set view position uniform
        let camPos = camera.getPosition();
        let viewPosLoc = gl.getUniformLocation(this.program, "u_viewpos")
        gl.uniform3fv(viewPosLoc, camPos.toFloat32());

        // set shininess uniform
        let shininessLoc = gl.getUniformLocation(this.program, "u_shininess");
        gl.uniform1f(shininessLoc, model.material.shininess);

        // model view and projection matrix uniforms
        let viewMatrix = camera.viewMatrix;
        let projectionMatrix = camera.projectionMatrix;
        let modelMatrixLoc = gl.getUniformLocation(this.program, "u_matrixM");
        gl.uniformMatrix4fv(modelMatrixLoc, false, model.modelMatrix.toFloat32());
        let viewMatrixLoc = gl.getUniformLocation(this.program, "u_matrixV");
        gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix.toFloat32());
        let projMatrixLoc = gl.getUniformLocation(this.program, "u_matrixP");
        gl.uniformMatrix4fv(projMatrixLoc, false, projectionMatrix.toFloat32());

        // set tint color data
        let colorLoc = gl.getUniformLocation(this.program, "u_tint");
        gl.uniform3fv(colorLoc, model.material.tint.toFloat32());
    }
}
