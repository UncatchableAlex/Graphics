"use strict";
var Primitives = {};

// Primitives class, create a new mesh from a primitive with:
// Primitives.TYPE.getMesh() where TYPE can be:
// 1. Triangle
// 2. Quad
// 3. Cube
// 4. Tetrahedron
// 5. Pyramid
// 6. Plane -> getMesh(xRes, yRes) where default is 10,10
// 7. Sphere -> getMesh(sectors, stacks) where default is 20,20
// 8. Cylinder -> getMesh(sectors) where default is 20

// just a triangle (XY plane)
Primitives.Triangle = class{
    static getMesh(){
        if(MeshCache["triangle"] !== undefined){
            return MeshCache["triangle"];
        }
        let positions = [-0.5, 0.0, 0.0,
                         0.5, 0.0, 0.0,
                         0.0, 0.5, 0.0];

        let normals =  [0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0];

        let indices =  [0, 1, 2];
        MeshCache["triangle"] = GLUtils.createMesh("triangle", gl.TRIANGLES, indices, positions, normals);
        return MeshCache["triangle"];
    }
}

// two triangles that form a square together (XY plane)
Primitives.Quad = class{
    static getMesh(){
        if(MeshCache["quad"] !== undefined){
            return MeshCache["quad"];
        }
        let positions = [-0.5, 0.5, 0.0,
                        -0.5,-0.5, 0.0,
                         0.5,-0.5, 0.0,
                         0.5, 0.5, 0.0];

        // TODO: fill in correct data for the normals. Make sure to consider the
        // ORIGINAL LOCAL coordinates for the vertex positions of the quad and NOT
        // their location and orientation in the scene!
        let normals =  [0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0];

        let indices =  [0, 1, 2,
                        2, 3, 0];
        MeshCache["quad"] = GLUtils.createMesh("quad", gl.TRIANGLES, indices, positions, normals);
        return MeshCache["quad"];
    }
}

// A basic 6 sided cube with edge length of 1
Primitives.Cube = class{
    static getMesh(){
        if(MeshCache["cube"] !== undefined){
            return MeshCache["cube"];
        }

        let positions =    [-0.5, 0.5, 0.5, //Front
                        -0.5,-0.5, 0.5,
                         0.5,-0.5, 0.5,
                         0.5, 0.5, 0.5,

                         0.5, 0.5,-0.5, //Back
                         0.5,-0.5,-0.5,
                        -0.5,-0.5,-0.5,
                        -0.5, 0.5,-0.5,

                        -0.5, 0.5,-0.5, //Top
                        -0.5, 0.5, 0.5,
                         0.5, 0.5, 0.5,
                         0.5, 0.5,-0.5,

                        -0.5,-0.5, 0.5, //Bottom
                        -0.5,-0.5,-0.5,
                         0.5,-0.5,-0.5,
                         0.5,-0.5, 0.5,

                         0.5, 0.5, 0.5, //Right
                         0.5,-0.5, 0.5,
                         0.5,-0.5,-0.5,
                         0.5, 0.5,-0.5,

                        -0.5, 0.5,-0.5, //Left
                        -0.5,-0.5,-0.5,
                        -0.5,-0.5, 0.5,
                        -0.5, 0.5, 0.5];

        let normals =  [0.0, 0.0, 1.0, //Front
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,

                        0.0, 0.0,-1.0, //Back
                        0.0, 0.0,-1.0,
                        0.0, 0.0,-1.0,
                        0.0, 0.0,-1.0,

                        0.0, 1.0, 0.0, //Top
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0,

                        0.0,-1.0, 0.0, //Bottom
                        0.0,-1.0, 0.0,
                        0.0,-1.0, 0.0,
                        0.0,-1.0, 0.0,

                        1.0, 0.0, 0.0, //Right
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0,

                       -1.0, 0.0, 0.0, //left
                       -1.0, 0.0, 0.0,
                       -1.0, 0.0, 0.0,
                       -1.0, 0.0, 0.0];

        let indices =  [0, 1, 2, //Front
                        2, 3, 0,

                        4, 5, 6, //Back
                        6, 7, 4,

                        8, 9, 10, //Top
                        10, 11, 8,

                        12, 13, 14, //Bottom
                        14, 15, 12,

                        16, 17, 18, //Right
                        18, 19, 16,

                        20, 21, 22, //left
                        22, 23, 20];

        MeshCache["cube"] = GLUtils.createMesh("cube", gl.TRIANGLES, indices, positions, normals);
        return MeshCache["cube"];
    }
}

// A Tetrahedron
Primitives.Tetrahedron = class{
    static getMesh(){
        if(MeshCache["tetrahedron"] !== undefined){
            return MeshCache["tetrahedron"];
        }

        // the positions (x,y,z) of the 4 corners (a, b, c, d) of a Tetrahedron
        // calculated so that the origin of the Tetrahedron [0,0,0] is in the
        // center with an equal distance to all points a, b, c, and d.
        let ax, ay, az,
            bx, by, bz,
            cx, cy, cz,
            dx, dy, dz;

        ax =  0.0;            ay =   1.0;  az =  0.0;
        bx =  0.0;            by = -(1/3); bz =  Math.sqrt(8/9);
        cx = -Math.sqrt(2/3); cy = -(1/3); cz = -Math.sqrt(2/9);
        dx =  Math.sqrt(2/3); dy = -(1/3); dz = -Math.sqrt(2/9);

        // oder of positions to have counter-clockwise winding order (default)
        let positions =    [ax, ay, az, // left
                            cx, cy, cz,
                            bx, by, bz,
                            ax, ay, az, // back
                            dx, dy, dz,
                            cx, cy, cz,
                            ax, ay, az, // right
                            bx, by, bz,
                            dx, dy, dz,
                            bx, by, bz, // down
                            cx, cy, cz,
                            dx, dy, dz];

        // calculate normals
        let nLx, nLy, nLz;  // normal left
        let nBx, nBy, nBz;  // normal back
        let nRx, nRy, nRz;  // normal right
        let nDx, nDy, nDz;  // normal down

        // all points have the same distance, and we can get the normals
        // from the opposite point of the side we calulate the normal for.
        // we just have to invert the point and normalize it.
        let length = Math.sqrt(ax*ax+ay*ay+az*az);

        nLx = -dx / length;
        nLy = -dy / length;
        nLz = -dz / length;

        nBx = -bx / length;
        nBy = -by / length;
        nBz = -bz / length;

        nRx = -cx / length;
        nRy = -cy / length;
        nRz = -cz / length;

        nDx = -ax / length;
        nDy = -ay / length;
        nDz = -az / length;

        let normals =  [nLx, nLy, nLz,
                        nLx, nLy, nLz,
                        nLx, nLy, nLz,
                        nBx, nBy, nBz,
                        nBx, nBy, nBz,
                        nBx, nBy, nBz,
                        nRx, nRy, nRz,
                        nRx, nRy, nRz,
                        nRx, nRy, nRz,
                        nDx, nDy, nDz,
                        nDx, nDy, nDz,
                        nDx, nDy, nDz];

        let indices =  [0, 1, 2,
                        3, 4, 5,
                        6, 7, 8,
                        9,10,11];

        MeshCache["tetrahedron"] = GLUtils.createMesh("tetrahedron", gl.TRIANGLES, indices, positions, normals);
        return MeshCache["tetrahedron"];
    }
}

// A basic 4 sided pyramid
Primitives.Pyramid = class{
    static getMesh(){
        if(MeshCache["pyramid"] !== undefined){
            return MeshCache["pyramid"];
        }

        let positions =[ 0.5, 0.0, 0.5,
                        -0.5, 0.0, 0.5,
                         0.5, 0.0,-0.5,

                        -0.5, 0.0, 0.5,
                        -0.5, 0.0,-0.5,
                         0.5, 0.0,-0.5,

                        -0.5, 0.0 , 0.5,
                         0.5, 0.0 , 0.5,
                         0.0, 0.75, 0.0,

                         0.5, 0.0 , 0.5,
                         0.5, 0.0 ,-0.5,
                         0.0, 0.75, 0.0,

                         0.5, 0.0 ,-0.5,
                        -0.5, 0.0 ,-0.5,
                         0.0, 0.75, 0.0,

                        -0.5, 0.0 ,-0.5,
                        -0.5, 0.0 , 0.5,
                         0.0, 0.75, 0.0];

        let sq2 = Math.sqrt(2);

        let normals = [ 0.0,-1.0, 0.0,
                        0.0,-1.0, 0.0,
                        0.0,-1.0, 0.0,

                        0.0,-1.0, 0.0,
                        0.0,-1.0, 0.0,
                        0.0,-1.0, 0.0,

                        0.0, sq2, sq2,
                        0.0, sq2, sq2,
                        0.0, sq2, sq2,

                        sq2, sq2, 0.0,
                        sq2, sq2, 0.0,
                        sq2, sq2, 0.0,

                        0.0, sq2,-sq2,
                        0.0, sq2,-sq2,
                        0.0, sq2,-sq2,

                       -sq2, sq2, 0.0,
                       -sq2, sq2, 0.0,
                       -sq2, sq2, 0.0];

        let indices =  [ 0, 1, 2,
                         3, 4, 5,
                         6, 7, 8,
                         9,10,11,
                        12,13,14,
                        15,16,17];

        MeshCache["pyramid"] = GLUtils.createMesh("pyramid", gl.TRIANGLES, indices, positions, normals);
        return MeshCache["pyramid"];
    }
}

// A XZ plane with variable resolution (vertex count), default is 10x10
Primitives.Plane = class{
    static getMesh(xRes=10, zRes=10){
        let meshName = "plane" + xRes + "x" + zRes;
        if(MeshCache[meshName] !== undefined){
            return MeshCache[meshName];
        }

        if(xRes < 2) xRes = 2;
        if(zRes < 2) zRes = 2;

        let scaleX = 4;
        let scaleZ = 4;

        let positions = [];
        let normals =  [];
        let indices =  [];

        // make positions, normals and uvs
        for(let z = 0; z < zRes; z++){
            let posZ = scaleZ/2.0 - scaleZ*(z/(zRes-1));
            for(let x = 0; x < xRes; x++){
                let posX = -scaleX/2.0 + scaleX*(x/(xRes-1));
                positions.push(posX);
                positions.push(0.0);
                positions.push(posZ);

                normals.push(0.0);
                normals.push(1.0);
                normals.push(0.0);
            }
        }

        // make indices
        for(let x = 0; x < xRes - 1; x++){
            for(let z = 0; z < zRes - 1; z++){
                let bottomleft = x + xRes*z;
                let bottomright = x + xRes*z + 1;
                let topleft = x + xRes*(z+1);
                let topright = x + 1 + xRes*(z+1);

                indices.push(bottomleft);
                indices.push(bottomright);
                indices.push(topleft);

                indices.push(topleft);
                indices.push(bottomright);
                indices.push(topright);
            }
        }

        MeshCache[meshName] = GLUtils.createMesh(meshName, gl.TRIANGLES, indices, positions, normals);
        return MeshCache[meshName];
    }
}

// A UV sphere (triangles are arranged in squares and streched around the sphere body)
// default sphere vertex count is 20 x 20
Primitives.Sphere = class {
    static getMesh(sectorCount = 20, stackCount = 20){
        if(MeshCache["sphere"] !== undefined){
            return MeshCache["sphere"];
        }

        // from: http://www.songho.ca/opengl/gl_sphere.html
        let radius = 1; // vertical count

        let positions = [];
        let normals = [];

        let x, y, z, xy;                          // vertex position
        let nx, ny, nz, lengthInv = 1.0 / radius; // vertex normal
        let s, t;                                 // vertex texCoord

        let sectorStep = 2 * Math.PI / sectorCount;
        let stackStep = Math.PI / stackCount;
        let sectorAngle, stackAngle;

        for(let i = 0; i <= stackCount; ++i)
        {
            stackAngle = Math.PI / 2 - i * stackStep;       // starting from pi/2 to -pi/2
            xy = radius * Math.cos(stackAngle);             // r * cos(u)
            z = radius * Math.sin(stackAngle);              // r * sin(u)

            // add (sectorCount+1) vertices per stack
            // the first and last vertices have same position and normal
            for(let j = 0; j <= sectorCount; ++j)
            {
                //sectorAngle = j * sectorStep;           // starting from 0 to 2pi
                sectorAngle = Math.PI - j * sectorStep; // starting from 2pi to 0, swaped order from source

                // vertex position (x, y, z)
                x = xy * Math.cos(sectorAngle);             // r * cos(u) * cos(v)
                y = xy * Math.sin(sectorAngle);             // r * cos(u) * sin(v)
                positions.push(x);
                positions.push(z);
                positions.push(y); // swaped order from source

                // normalized vertex normal (nx, ny, nz)
                nx = x * lengthInv;
                ny = y * lengthInv;
                nz = z * lengthInv;
                normals.push(nx);
                normals.push(nz);
                normals.push(ny); // swaped out y and z from source

                // vertex tex coord (s, t) range between [0, 1]
                s = j / sectorCount;
                t = i / stackCount;
            }
        }
        // generate CCW index list of sphere triangles
        // k1--k1+1
        // |  / |
        // | /  |
        // k2--k2+1
        let indices = [];
        // let lineIndices = [];
        let k1, k2;
        for(let i = 0; i < stackCount; ++i)
        {
            k1 = i * (sectorCount + 1);     // beginning of current stack
            k2 = k1 + sectorCount + 1;      // beginning of next stack

            for(let j = 0; j < sectorCount; ++j, ++k1, ++k2)
            {
                // 2 triangles per sector excluding first and last stacks
                // k1 => k2 => k1+1
                if(i != 0)
                {
                    indices.push(k1);
                    indices.push(k2);
                    indices.push(k1 + 1);
                }

                // k1+1 => k2 => k2+1
                if(i != (stackCount-1))
                {
                    indices.push(k1 + 1);
                    indices.push(k2);
                    indices.push(k2 + 1);
                }
            }
        }
        MeshCache["sphere"] = GLUtils.createMesh("sphere", gl.TRIANGLES, indices, positions, normals);
        return MeshCache["sphere"];
    }
}

// a cynlinder with a variable amount of sectors
Primitives.Cylinder = class {
    static getMesh(sectorCount = 20){
        if(MeshCache["cylinder"] !== undefined){
            return MeshCache["cylinder"];
        }

        let radius = 0.5; // vertical count
        let height = 2;

        let positions = [];
        let normals = [];
        let indices = [];

        let x, y, z, xy;                          // vertex position
        let nx, ny, nz, lengthInv = 1.0 / radius; // vertex normal
        let s, t;                                 // vertex texCoord

        let sectorStep = 2 * Math.PI / sectorCount;
        let sectorAngle;

        // first cirle center
        y = 0.5*height;
        positions.push(0.0);
        positions.push(y);
        positions.push(0.0);

        normals.push(0.0);
        normals.push(1.0);
        normals.push(0.0);

        // first circle
        for(let i = 0; i < sectorCount; ++i){
            sectorAngle = i * sectorStep; // starting from 2pi to 0
            x = Math.sin(sectorAngle); // r * cos(u) * cos(v)
            z = -Math.cos(sectorAngle);

            positions.push(x * radius);
            positions.push(y);
            positions.push(z * radius);

            normals.push(0.0);
            normals.push(1.0);
            normals.push(0.0);
        }

        for(let i = 0; i < sectorCount; ++i){
            indices.push(i + 1);
            indices.push(0);
            if(i + 2 <= sectorCount){
                indices.push(i + 2);
            } else {
                indices.push(1);
            }
        }

        // second cirle center
        y = -0.5*height;
        positions.push(0.0);
        positions.push(y);
        positions.push(0.0);

        normals.push(0.0);
        normals.push(-1.0);
        normals.push(0.0);

        // second circle
        for(let i = 0; i < sectorCount; ++i){
            sectorAngle = Math.PI - i * sectorStep; // starting from 2pi to 0
            x = Math.sin(sectorAngle); // r * cos(u) * cos(v)
            z = Math.cos(sectorAngle);

            positions.push(x * radius);
            positions.push(y);
            positions.push(z * radius);

            normals.push(0.0);
            normals.push(-1.0);
            normals.push(0.0);
        }

        let start = sectorCount + 1;
        for(let i = start; i < start+sectorCount; ++i){
            indices.push(start);
            indices.push(i + 1);
            if(i + 2 <= start + sectorCount){
                indices.push(i + 2);
            } else {
                indices.push(start + 1);
            }
        }

        // connection
        for(let i = 0; i < 2; ++i)
        {
            y = height*(i-0.5);
            // add (sectorCount+1) vertices per stack
            // the first and last vertices have same position and normal
            for(let j = 0; j <= sectorCount; ++j)
            {
                //sectorAngle = j * sectorStep;          // starting from 0 to 2pi
                sectorAngle = Math.PI - j * sectorStep; // starting from 2pi to 0, swaped order from source

                // vertex position (x, y, z)
                x = Math.sin(sectorAngle) * radius; // r * cos(u) * cos(v)
                z = Math.cos(sectorAngle) * radius;
                positions.push(x);
                positions.push(y);
                positions.push(z);

                // normalized vertex normal (nx, ny, nz)
                nx = x;
                ny = 0.0;
                nz = z;
                normals.push(nx * lengthInv);
                normals.push(ny);
                normals.push(nz * lengthInv);
            }
        }

        // k1--k1+1
        // |  / |
        // | /  |
        // k2--k2+1
        let k1,k2;
        start = sectorCount*2 + 2;

        k1 = start;
        k2 = k1 + sectorCount + 1;

        for(let j = 0; j <= sectorCount-1; ++j, ++k1, ++k2)
        {
            indices.push(k1);
            indices.push(k2);
            indices.push(k1 + 1);

            indices.push(k1 + 1);
            indices.push(k2);
            indices.push(k2 + 1);
        }
        MeshCache["cylinder"] = GLUtils.createMesh("cylinder", gl.TRIANGLES, indices, positions, normals);
        return MeshCache["cylinder"];
    }
}
