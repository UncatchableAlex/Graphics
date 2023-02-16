"use strict";
class Quad{
    /**
    * Contructor: Creates an instance of Quad.
    * @param {float} offsetX the center of the Quad on the x axis.
    * @param {float} offsetY the center of the Quad on the y axis.
    * @param {float} scale the scale of the Quad.
    * @param {array} tint the tint-color [r,g,b] of the Quad.
    */
    constructor(offsetX, offsetY, scale, tint){
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.scale = scale;
        this.tint = tint;

        this.positionData = [
            -0.25, -0.25,
            0.25, -0.25, 
            -0.25, 0.25, 
            0.25, 0.25];

        this.indexData = [
            0, 1, 2,
            2, 1, 3
        ];

        // create position buffer.
        this.positionBuffer = gl.createBuffer();
        // set id to the current active array buffer (only one can be active).
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // upload buffer data.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positionData), gl.STATIC_DRAW);
        this.vertexCount = 6;

        // create, bind, and load the index buffer:
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexData), gl.STATIC_DRAW);
	}
};
