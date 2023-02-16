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

        this.positionData = [];

        this.indexData = [];

        // create position buffer.
        this.positionBuffer = gl.createBuffer();
        // set id to the current active array buffer (only one can be active).
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // upload buffer data.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positionData), gl.STATIC_DRAW);

        this.vertexCount = 6;
	}
};
