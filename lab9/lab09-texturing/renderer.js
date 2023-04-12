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
    drawModel(model, camera, shaderData){

        // don't draw if the model hasn't been fully loaded yet (vertex count is 0)
        if(model.mesh.indexCount === 0) return;

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

        // normal buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.normalBuffer);
        let normalAttribLoc = gl.getAttribLocation(this.program, "a_normal");
        gl.enableVertexAttribArray(normalAttribLoc);
        gl.vertexAttribPointer(normalAttribLoc,3,gl.FLOAT,false,0,0);

        // Link up texcoord-buffer (model.mesh.texcoordBuffer) and
        // a_texcoord attribute in vertex shader. See normal and position setup
        // above for reference.
        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.texcoordBuffer);
        let texAttribLoc = gl.getAttribLocation(this.program, "a_texcoord");
        gl.enableVertexAttribArray(texAttribLoc);
        gl.vertexAttribPointer(texAttribLoc, 2, gl.FLOAT, false, 0, 0);
    }

    /**
    * Sets ALL uniforms for the vertex and fragment shader of this renderers shader program before drawing.
    * @param {ModelTransform} model the model to draw.
    * @param {Object} shaderData whatever other data the Shader needs for drawing.
    */
    setUniformData(model, camera, shaderData){

        let viewMatrix = camera.viewMatrix;
        let projectionMatrix = camera.projectionMatrix;

        // set model, view and projection matrices in the vertex shader
        let modelMatrixLoc = gl.getUniformLocation(this.program, "u_matrixM");
        gl.uniformMatrix4fv(modelMatrixLoc, false, model.modelMatrix.toFloat32());
        let viewMatrixLoc = gl.getUniformLocation(this.program, "u_matrixV");
        gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix.toFloat32());
        let projMatrixLoc = gl.getUniformLocation(this.program, "u_matrixP");
        gl.uniformMatrix4fv(projMatrixLoc, false, projectionMatrix.toFloat32());

        // set tint color data
        let colorLoc = gl.getUniformLocation(this.program, "u_tint");
        gl.uniform3fv(colorLoc, model.material.tint.toFloat32());

        // set model inverse transpose to enable lighting calulations using normals
        let invtransLoc = gl.getUniformLocation(this.program, "u_matrixInvTransM");
        gl.uniformMatrix3fv(invtransLoc, false, M4.inverseTranspose3x3(model.modelMatrix).toFloat32());

        // directional and ambient lighting lighting
        let lightDirLoc = gl.getUniformLocation(this.program, "u_directionalLight");
        gl.uniform3fv(lightDirLoc, shaderData.lightingData.directionalLight.toFloat32());

        let lightColLoc = gl.getUniformLocation(this.program, "u_directionalColor");
        gl.uniform3fv(lightColLoc, shaderData.lightingData.directionalColor.toFloat32());

        let ambColLoc = gl.getUniformLocation(this.program, "u_ambientColor");
        gl.uniform3fv(ambColLoc, shaderData.lightingData.ambientColor.toFloat32());

        // texturing
        gl.activeTexture(gl.TEXTURE0);
        let mainTexture = TextureCache[model.material.mainTexture];
        gl.bindTexture(gl.TEXTURE_2D, mainTexture);
        let mainTexLoc = gl.getUniformLocation(this.program, "u_mainTex");
        gl.uniform1i(mainTexLoc, 0);
        //TODO: Link texture information to sampler2D uniform in the fragment shader.
        // 1. Set active Texture Unit (gl.TEXTURE0)
        // 2. Bind texture from TextureCache (TextureCache[model.material.mainTexture])
        // 3. Get uniform location of u_mainTex texture sampler2D
        // 4. Link to Texture Unit 0 (see 1., with bound texture from 2.) to uniform sampler2D
        //      - this is equivalent to setting the uniform from location 3. to
        //      an integer with value 0! -> gl.uniform1i(...)
    }
}
