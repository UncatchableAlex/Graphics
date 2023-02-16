"use strict";
class Triangle{
    /**
    * Contructor: Creates an instance of Triangle.
    * @param {float} offsetX the center of the Triangle on the x axis.
    * @param {float} offsetY the center of the Triangle on the y axis.
    */
    constructor(offsetX, offsetY, size){
        // assign properties of the Triangle object.
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.size = size;

        // TODO: enter values for position data.
       // let r3o2 = sqrt(3) / 2;
        /*this.positionData = [
            offsetX, offsetY - size, // top point
            offsetX + (size * 0.5), offsetY + (size * r302), // bottom right point
            offsetX - (size * 0.5), offsetY + (size * r302)]; // bottom left point*/
        this.positionData = new Float32Array([
            0, 0.25, 
            -0.25, -0.25,
            0.25, -0.25
        ]);

        // TODO: add another property (array) for the color data and enter values.
        this.colorData = new Float32Array([
            0, 0, 1,
            1, 0, 0,
            0, 1, 0
        ]);
        // TODO: Create and fill position buffer with data.
        // 1. Create Buffer and assign to this.positionBuffer property.
        this.positionBuffer = gl.createBuffer();
        // 2. Bind buffer (remeber to use this.positionBuffer, since positionBuffer is a property of this object).
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // 3. Set buffer data (remember to make Float32Array first).
        gl.bufferData(gl.ARRAY_BUFFER, this.positionData, gl.STATIC_DRAW);
        // TODO: repeat for color buffer.
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colorData, gl.STATIC_DRAW);
        // a_color is a vec3, so vertexSize needs to be 3!
        this.vertexCount = 3;
	}
};
