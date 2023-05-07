    "use strict";

    class Renderer{

        /**
        * Creates a new instance of Renderer. The given source code will be compiled
        * and assembled into a WebGL ShaderProgram used by this shader to draw models.
        * @param {string} shaderName the source code (text) of this shader programs shader.
        */
        constructor(shaderName, windDir,  windAmp, windVelocity, windFreq){
            this.windDir = windDir || new Vec([0,0]);
            this.windVelocity = windVelocity || 0;
            this.windAmp = windAmp || 0;
            this.windFreq = windFreq || 0;
            this.program = GLUtils.createShaderProgram(shaderName);
            this.date = new Date();
            this.windDir.normalize();
        }

        /**
        * Draws a bunch of copies of the given model using instancing. Uses this Renderer's ShaderProgram.
        * @param {ModelTransform} model the model to draw.
        * @param {PerspectiveCamera} camera the camera used to draw the scene
        * @param {Array<Number>} translations the translations to be applied to each instance of the model being drawn
        * @param {Object} shaderData whatever other data the ShaderProgram needs for drawing.
        */
        drawModels(model, camera, shaderData, translations){

            // don't draw if the model hasn't been fully loaded yet (vertex count is 0)
            if(model.mesh.indexCount === 0) return;

            // activate this shader program
            gl.useProgram(this.program);

            // set the arrtibute arrays and uniform data for this programs vertex and
            // fragment shader based on the models buffer data and material
            this.setVertexAttributeArrays(model, translations);
            this.setUniformData(model, camera, shaderData);

            // draw call using index based triangle assembly (elements)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.mesh.bufIndex);
            //gl.drawElements(model.mesh.drawMode, model.mesh.indexCount, gl.UNSIGNED_SHORT, 0);
            ext.drawElementsInstancedANGLE(gl.TRIANGLES, model.mesh.indexData.length, gl.UNSIGNED_SHORT,0,translations.length);
            return this;
        }

        /**
        * Sets ALL attributes for the vertex shader of this renderers shader program before drawing.
        * @param {ModelTransform} model the model to draw.
        */
        setVertexAttributeArrays(model, translations){
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

            // Link up texcoord-buffer (model.mesh.texcoordBuffer)
            gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.texcoordBuffer);
            let texAttribLoc = gl.getAttribLocation(this.program, "a_texcoord");
            gl.enableVertexAttribArray(texAttribLoc);
            gl.vertexAttribPointer(texAttribLoc, 2, gl.FLOAT, false, 0, 0);

            // for info on instancing read https://webglfundamentals.org/webgl/lessons/webgl-instanced-drawing.html
            const matrixData = new Float32Array(translations.length * 16);
            const matrices = [];
            const matrixLoc = gl.getAttribLocation(this.program, 'a_matrixM');

            for (let i = 0; i < translations.length; ++i) {
                const byteOffsetToMatrix = i * 16 * 4;
                const numFloatsForView = 16;
                matrices.push(new Float32Array(
                    matrixData.buffer,
                    byteOffsetToMatrix,
                    numFloatsForView));
            }
            const matrixBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
            // just allocate the buffer
            gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);
            // update all the matrices
            matrices.forEach((mat, idx) => {
                // update the position of model and copy its modelMatrix over to matrixData
                model.position.set(translations[idx]);
                model.updateMatrix();
                for (let i = 0; i < model.modelMatrix.length; i++) {
                    mat[i] = model.modelMatrix[i];
                }
            });
            gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);

            // set all 4 attributes for matrix
            const bytesPerMatrix = 4 * 16;
            for (let i = 0; i < 4; i++) {
                const loc = matrixLoc + i;
                gl.enableVertexAttribArray(loc);
                // note the stride and offset
                const offset = i * 16;  // 4 floats per row, 4 bytes per float
                gl.vertexAttribPointer(
                    loc,              // location
                    4,                // size (num values to pull from buffer per iteration)
                    gl.FLOAT,         // type of data in buffer
                    false,            // normalize
                    bytesPerMatrix,   // stride, num bytes to advance to get to next set of values
                    offset,           // offset in buffer
                );
                // this line says this attribute only changes for each 1 instance
                ext.vertexAttribDivisorANGLE(loc, 1);
            }
        }

        /**
        * Sets ALL uniforms for the vertex and fragment shader of this renderers shader program before drawing.
        * @param {ModelTransform} model the model to draw.
        * @param {Object} shaderData whatever other data the Shader needs for drawing.
        */
        setUniformData(model, camera, shaderData){
            // make some local variables for the lighting data to avoid spaghetti code
            let lightPosition = shaderData.lightingData.lightPosition;
            let lightColor = shaderData.lightingData.lightColor;

            // set uniform data for directional lighting
            let lightColorLocation = gl.getUniformLocation(this.program, "u_lightcolor");
            gl.uniform3fv(lightColorLocation, lightColor.toFloat32());
            // set data for inverse transpose 3x3 matrix uniform
            let lightPosLoc = gl.getUniformLocation(this.program, "u_lightposition");
            gl.uniform3fv(lightPosLoc, lightPosition.toFloat32());

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


            let viewMatrixLoc = gl.getUniformLocation(this.program, "u_matrixV");
            gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix.toFloat32());
            let projMatrixLoc = gl.getUniformLocation(this.program, "u_matrixP");
            gl.uniformMatrix4fv(projMatrixLoc, false, projectionMatrix.toFloat32());

            // set tint color data
            let colorLoc = gl.getUniformLocation(this.program, "u_tint");
            gl.uniform3fv(colorLoc, model.material.tint.toFloat32());

            // set the inverse transposed model matrix
            let matrixInvTransMLoc = gl.getUniformLocation(this.program, "u_matrixInvTransM");
            let invTrans = model.modelMatrix.transpose();
            invTrans.invert();
            gl.uniformMatrix4fv(matrixInvTransMLoc, false, invTrans.toFloat32());

            // set the texture
            gl.activeTexture(gl.TEXTURE0);
            let mainTexture = TextureCache[model.material.mainTexture];
            gl.bindTexture(gl.TEXTURE_2D, mainTexture);
            let mainTexLoc = gl.getUniformLocation(this.program, "u_mainTex");
            gl.uniform1i(mainTexLoc, 0);


            // set wind params:
            let windDirLoc = gl.getUniformLocation(this.program, "u_windDir");
            gl.uniform2fv(windDirLoc, this.windDir.toFloat32());

            // number of seconds since this renderer object was initialized:
            let time = (new Date().getTime() - this.date.getTime()) / 1000.0;
            let windCoefsLoc = gl.getUniformLocation(this.program, "u_windCoefs");
            gl.uniform4fv(windCoefsLoc, new Float32Array([this.windAmp, this.windVelocity, this.windFreq, time]));
           // this.windDir[0] = Math.cos(time / 10);
           // this.windDir[1] = Math.sin(time / 10);
            //console.log([this.windAmp, this.windVelocity, this.windFreq, time]);
        }
    }
