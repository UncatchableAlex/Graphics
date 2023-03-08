"use strict";

var Primitives = {};
Primitives.Quad2D = class{
    static getMesh(){
        // if there is already a quad2d in the MeshCache use that instead
        if(MeshCache["quad2d"] !== undefined){
            return MeshCache["quad2d"];
        }
        // if not, then make a new quad2d and add that to the MeshCache
        let positionData = [-0.5, 0.5,
                            -0.5,-0.5,
                             0.5,-0.5,
                             0.5, 0.5];
        let indexData =[0, 1, 2,
                        2, 3, 0];
        return GLUtils.createMesh("quad2d", gl.TRIANGLES, indexData, positionData);
    }
}

Primitives.Star2D = class{
    static getMesh(){
        if(MeshCache["star2d"] !== undefined){
            return MeshCache["star2d"];
        }
        let positionData = [
             0.00, 0.00,
             0.00, 0.75,
             0.25, 0.50,
             0.50, 0.50,
             0.50, 0.25,
             0.75, 0.00,
             0.50,-0.25,
             0.50,-0.50,
             0.25,-0.50,
             0.00,-0.75,
            -0.25,-0.50,
            -0.50,-0.50,
            -0.50,-0.25,
            -0.75, 0.00,
            -0.50, 0.25,
            -0.50, 0.50,
            -0.25, 0.50
         ];
        let indexData = [
          0, 1, 2,
          0, 2, 3,
          0, 3, 4,
          0, 4, 5,
          0, 5, 6,
          0, 6, 7,
          0, 7, 8,
          0, 8, 9,
          0, 9,10,
          0,10,11,
          0,11,12,
          0,12,13,
          0,13,14,
          0,14,15,
          0,15,16,
          0,16, 1
        ];
        return GLUtils.createMesh("star2d", gl.TRIANGLES, indexData, positionData);
    }
}

Primitives.Circle2D = class{
    static getMesh(){
        if(MeshCache["circle2d"] !== undefined){
            return MeshCache["circle2d"];
        }
        let positionData = [];
        positionData.push(0.0);
        positionData.push(0.0);
        let triangleCount = 16;
        for (var i=0; i<=triangleCount; i++){
            positionData.push(Math.sin(2 * Math.PI * i/triangleCount) * 0.5);
            positionData.push(Math.cos(2 * Math.PI * i/triangleCount) * 0.5);
        }
        let indexData = [
          0, 1, 2,
          0, 2, 3,
          0, 3, 4,
          0, 4, 5,
          0, 5, 6,
          0, 6, 7,
          0, 7, 8,
          0, 8, 9,
          0, 9,10,
          0,10,11,
          0,11,12,
          0,12,13,
          0,13,14,
          0,14,15,
          0,15,16,
          0,16, 1
        ];
        return GLUtils.createMesh("circle2d", gl.TRIANGLES, indexData, positionData);
    }
}

Primitives.Bird2D = class{
    static getMesh(){
        if(MeshCache["bird2d"] !== undefined){
            return MeshCache["bird2d"];
        }
        let positionData = [
            0.0, 0.5,
            0.25, 0.0,
            0.75, -0.25,
            0.1, -0.25,
            0.25, -0.5,
            -0.25, -0.5,
            -0.1, -0.25,
            -0.75, -0.25,
            -0.25, 0.0
        ];

        let indexData = [
            0, 1, 8,
            1, 3, 8,
            8, 3, 6,
            1, 2, 3,
            3, 4, 6,
            6, 4, 5,
            8, 6, 7
        ];
        return GLUtils.createMesh("bird2d", gl.TRIANGLES, indexData, positionData);
    }
}

Primitives.Triangle2D = class{
    static getMesh(){
        // if there is already a 2d triangle in the MeshCache, return that
        // instead of making a new one.
        if(MeshCache["triangle2d"] !== undefined){
            return MeshCache["triangle2d"];
        }

        // TODO: Add the positionData and indexData for a triangle mesh.
        let positionData = [
            0.0, 0.5,
            0.5, 0.0,
            -0.5, 0.0
        ];
        let indexData = [0, 1, 2];

        // make a new triange mesh and add it to the MeshCache.
        return GLUtils.createMesh("triangle2d", gl.TRIANGLES, indexData, positionData);
    }
}
