"use strict";
class Circle {
    /**
    * Contructor: Creates an instance of Circle
    * @param {float} offsetX the center of the Circle on the x axis.
    * @param {float} offsetY the center of the Circle on the y axis.
    */
    constructor(offsetX, offsetY, radius, numEdges, tint) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.radius = radius;
        this.tint = tint;
        let pts = [offsetX, offsetY];
        // add points around the edge
        for (let i = 0; i <= numEdges; i++) {
            let angle = 2 * Math.PI * i / numEdges;
            pts.push((Math.cos(angle) * radius) + offsetX);
            pts.push((Math.sin(angle) * radius) + offsetY);
        }
        this.positionData = new Float32Array(pts);
        // make and set the position buffer
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.positionData, gl.STATIC_DRAW);
        this.vertexCount = numEdges + 2;
    }
}
