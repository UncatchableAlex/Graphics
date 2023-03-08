"use strict";
class TreeRenderer extends Renderer {
    setUniformData (model, shaderData) {
        super.setUniformData(model, shaderData);
        let timeLoc = gl.getUniformLocation(this.program, "u_Time");
        gl.uniform1f(timeLoc, shaderData.time);
        let lowestLoc = gl.getUniformLocation(this.program, "u_Lowest");
        let lowest = Infinity;
        let pts = model.mesh.positionData
        for(let i = 1; i < pts.length; i += 2) {
            lowest = Math.min(pts[i], lowest);
        }
        //console.log(model.mesh);
        gl.uniform1f(lowestLoc, lowest);
    }
}