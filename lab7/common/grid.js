"use strict" ;
class GridAxis{
    static getMesh(){
        if(MeshCache["grid"] !== undefined){
            return MeshCache["grid"];
        }

        let verts = [];
        let size = 1.9;                 //Width and Height of the GridAxis
        let lineCount = 10;             //How many lines vertical and horizontal
        let step = size/lineCount;      //distance between each line
        let half = size/2;              //halfsize of the grid for easy access during calculations

        let p; // temporary varibale to store positin during calculations
        for(let i = 0; i <= lineCount; i++){
            if(i === lineCount/2) continue; // dont draw center axis lines
            //Vertical line
			p = -half + (i * step);
			verts.push(p);		//x1
			verts.push(0);		//y1
			verts.push(half);	//z1
			verts.push(0.7);	//cr
            verts.push(0.7);	//cg
            verts.push(0.7);	//cb

			verts.push(p);		//x2
			verts.push(0);		//y2
			verts.push(-half);	//z2
            verts.push(0.7);	//cr
            verts.push(0.7);	//cg
            verts.push(0.7);	//cb

			//Horizontal line
			p = half - (i * step);
			verts.push(-half);	//x1
			verts.push(0);		//y1
			verts.push(p);		//z1
            verts.push(0.7);	//cr
            verts.push(0.7);	//cg
            verts.push(0.7);	//cb

			verts.push(half);	//x2
			verts.push(0);		//y2
			verts.push(p);		//z2
            verts.push(0.7);	//cr
            verts.push(0.7);	//cg
            verts.push(0.7);	//cb
        }
			//x axis
			verts.push(-1.1);	//x1
			verts.push(0.0);	//y1
			verts.push(0.0);	//z1
            verts.push(1.0);	//cr
            verts.push(0.0);	//cg
            verts.push(0.0);	//cb

			verts.push(1.1);	//x2
			verts.push(0.0);	//y2
			verts.push(0.0);	//z2
            verts.push(1.0);	//cr
            verts.push(0.0);	//cg
            verts.push(0.0);	//cb

			//y axis
			verts.push(0);      //x1
			verts.push(-1.1);	//y1
			verts.push(0);		//z1
            verts.push(0.0);	//cr
            verts.push(1.0);	//cg
            verts.push(0.0);	//cb

			verts.push(0);		//x2
			verts.push(1.1);	//y2
			verts.push(0);		//z2
            verts.push(0.0);	//cr
            verts.push(1.0);	//cg
            verts.push(0.0);	//cb

			//z axis
			verts.push(0);		//x1
			verts.push(0);		//y1
			verts.push(-1.1);	//z1
            verts.push(0.0);	//cr
            verts.push(0.0);	//cg
            verts.push(1.0);	//cb

			verts.push(0);		//x2
			verts.push(0);		//y2
			verts.push(1.1);	//z2
            verts.push(0.0);	//cr
            verts.push(0.0);	//cg
            verts.push(1.0);	//cb

        // set up mesh container
        let mesh = {};
        mesh.drawMode = gl.LINES;

        mesh.vertexComponentLen = 6;
		mesh.vertexCount = verts.length / mesh.vertexComponentLen;

        // set up buffers
        mesh.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

        // clean up
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        MeshCache["grid"] = mesh;
        return mesh;
    }

    constructor(){
        this.mesh = GridAxis.getMesh(gl);
        this.position   = new V3(0,0,0);
        this.scale      = new V3(1,1,1);
        this.rotation   = new V3(0,0,0);
        this.modelMatrix = M4.IDENTITY;
        this.program = this.createShaderProgram();

        gl.useProgram(this.program);
        this.modelMatrixLoc = gl.getUniformLocation(this.program, "u_matrixM");
        this.modelMatrixLoc = gl.getUniformLocation(this.program, "u_matrixM");
        this.modelMatrixLoc = gl.getUniformLocation(this.program, "u_matrixM");
        this.modelMatrixLoc = gl.getUniformLocation(this.program, "u_matrixM");

        this.posAttribLoc = gl.getAttribLocation(this.program, "a_position");
        this.colAttribLoc = gl.getAttribLocation(this.program, "a_vertexcolor");
    }

    draw(camera){
        let viewMatrix = camera.viewMatrix;
        let projectionMatrix = camera.projectionMatrix;

        this.modelMatrix = M4.translationMatrix(this.position.x,this.position.y,this.position.z);
        this.modelMatrix = M4.multM4(this.modelMatrix, M4.rotationMatrixY(this.rotation.y));
        this.modelMatrix = M4.multM4(this.modelMatrix, M4.rotationMatrixX(this.rotation.x));
        this.modelMatrix = M4.multM4(this.modelMatrix, M4.rotationMatrixZ(this.rotation.z));
        this.modelMatrix = M4.multM4(this.modelMatrix, M4.scaleMatrix(this.scale.x,this.scale.y,this.scale.z));

        gl.useProgram(this.program);

        // set model, view and projection matrices in the vertex shader
        let modelMatrixLoc = gl.getUniformLocation(this.program, "u_matrixM");
        gl.uniformMatrix4fv(modelMatrixLoc, false, this.modelMatrix.toFloat32());
        let viewMatrixLoc = gl.getUniformLocation(this.program, "u_matrixV");
        gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix.toFloat32());
        let projMatrixLoc = gl.getUniformLocation(this.program, "u_matrixP");
        gl.uniformMatrix4fv(projMatrixLoc, false, projectionMatrix.toFloat32());

        //set Attribute Pointer
        let strideLen = Float32Array.BYTES_PER_ELEMENT * this.mesh.vertexComponentLen; //Stride Length is the Vertex Size for the buffer in Bytes

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);

        gl.enableVertexAttribArray(this.posAttribLoc);
        gl.vertexAttribPointer(this.posAttribLoc,3,gl.FLOAT,false,strideLen,0);                                 //stride offsets by how much

        gl.enableVertexAttribArray(this.colAttribLoc);
        gl.vertexAttribPointer(this.colAttribLoc,3,gl.FLOAT,false,strideLen,
            Float32Array.BYTES_PER_ELEMENT * 3);  //skip first 3 floats in our vertex chunk, its like str.substr(3,1) in theory.

        gl.drawArrays(this.mesh.drawMode, 0, this.mesh.vertexCount);
        return this;
	}

    createShaderProgram(){
        let vertexSrc =
            `attribute vec3 a_position; // the position of each vertex
            attribute vec3 a_vertexcolor; // the color of each vertex
            uniform mat4 u_matrixM; // the model matrix of this object
            uniform mat4 u_matrixV; // the view matrix of the camera
            uniform mat4 u_matrixP; // the perspective matrix of the camera
            varying vec3 vertexcolor; // varying to bring vertexcolor to the fragment shader
            void main() {
                gl_Position = u_matrixP * u_matrixV * u_matrixM * vec4 (a_position, 1);
                vertexcolor = a_vertexcolor;
            }`;
        let fragmentSrc =
            `precision highp float; //float precision settings
            varying vec3 vertexcolor; // vertexcolor from vertex shader
            void main(){
                gl_FragColor = vec4(vertexcolor, 1);
            }`;
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(vertexShader, vertexSrc);
        gl.shaderSource(fragmentShader, fragmentSrc);
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
        return shaderProgram;
    }
}
