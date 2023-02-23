"use strict";
class ModelTransform{
    /**
    * Creates an instance of ModelTransform.
    * @param {Vector2} position the center of the model in world space.
    * @param {float} rotation the rotation of the model (in degrees).
    * @param {Vector2} scale width and height of the model.
    * @param {Vector3} tint the color of the model in [r,g,b].
    */
    constructor(position, rotation, scale, tint){

        // set properties of transform (clone vectors to avoid accidental referencing)
        this.position = position.clone();
        this.rotation = rotation;
        this.scale = scale;
        this.tint = tint.clone();

        // create and initialize Model Matrix
        this.modelMatrix = new M3();
        this.updateMatrix();

        // use fixed position data, positioning will be done by transformation matrix
        let positionData = [
             0.00,-0.2,
             0.30, 0.2,
            -0.30, 0.2,
             0.00, 0.2,
             0.10, 0.4,
            -0.10, 0.4,
            -0.40, 0.0,
            -0.21, 0.1,
             0.21, 0.1,
             0.40, 0.0,
            -0.05, 0.0,
            -0.20,-0.4,
             0.20,-0.4,
             0.05, 0.0
         ];

        let indexData = [
          0, 1, 2, // body
          3, 4, 5, // head
          2, 6, 7, // left arm
          1, 8, 9, // right arm
          0,10,11, // left leg
          0,12,13 // left leg
        ];

        // create buffer id
        this.positionBuffer = gl.createBuffer();
        // set id to the current active array buffer (only one can be active)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // upload buffer data
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW);

        // create buffer id
        this.indexBuffer = gl.createBuffer();
        // set id to the current active array buffer (only one can be active)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // upload buffer data
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);

        this.vertexCount = indexData.length;
	}

    updateMatrix(){
        this.modelMatrix.reset(); // we reset the matrix first and then calculate the new matrix from position, rotation and scale.

        // TODO: complete function
        //update the modelMatrix of this quad using its position, rotaton and scale
        //use the respective functions in your math library to achieve this.

        //Hints:
        // the correct order for multiplications is translation * rotation * scale (since you want the scale
        // to happen first and the multiplication resolves backwards.) The M3.multM3(a,b) function multiplies
        // a and b and returns a new matrix as result. Since our functions can only multiply 2 matrices at a time,
        // you need to do it in multible steps.

        // To make sure each matrix applies correctly try them first individually and observe how they affect the model.
        // Start ONLY with Translation
        // then  ONLY Translation and Rotation
        // then  ONLY Translation and Scale
        // and last ALL combined
        // If you notice a kind of "shearing" effect, there is something wrong in the order
        // or your multiplication function.
    }
};
