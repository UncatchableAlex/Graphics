/*
Matrix object. Does matrix things. The matrix is stored internally as a 1d array with indices
|0   n  2n  3n .  .  .  n(m-1)|
|1     .                      |
|2        .                   |
|.           .                |
|.              .             |
|.                 .          |
|n-1                   (n*m)-1|

For example, a 3x3 matrix would be stored in a 1d array with the following indices:
|0  3  6|
|1  4  7|
|2  5  8|


Author: Alex Meislich
Date: 2023-04-16
*/

class Mat extends Array{
    /**
     * Set the contents of our matrix to the contents given.
     */
    constructor(contents, m, n) {
        super(0);
        if (m * n != contents.length) {
            throw "matrix contents of incorrect size for m x n matrix";
        }
        this.n = n;
        this.m = m;
        for (let i = 0; i < contents.length; i++) {
            this[i] = contents[i];
        }
    }


    static __mult__(left, right) {
        if (left.n != right.m) {
            throw "matrix mult size mismatch";
        }
        let res = [];
        for (let i = 0; i < right.n; i++) {
            for (let j = 0; j < left.m; j++) {
                let ele = 0;
                for (let k = 0; k < left.n; k++) {
                    ele += left[j + left.m*k] * right[k + right.m*i];
                }
                res.push(ele);
            }
        }
        return res;
    }

    /**
     * Multiplies two matrices
     * @param {Mat} left the matrix on the left side of the multiplication
     * @param {Mat} right the matrix on the right side of the multiplication
     * @returns The product of left and right
     */
    static mult(left, right) {
        return new Mat(Mat.__mult__(left, right), left.m, right.n);
    }



    /**
     * Does an inplace reduction to reduced row echelon form using gauss-jordan elimination and returns
     * the coefficient by which the determinant was scaled (useless for non-square matrices, I think).
     * See https://www.statlect.com/matrix-algebra/Gauss-Jordan-elimination
     */
    rref() {
        let h = 0; // pivot row
        let k = 0; // pivot column
        let det_scale = 1; // keep track of the determinant
        while (k < this.n && h < this.m) {
            let i_max = h; // the row of the greatest value in our matrix in column k between rows h + 1 and m - 1
            for (let i = h + 1; i < this.m; i++) {
                if (Math.abs(this[i + this.m*k]) > Math.abs(this[i_max + this.m*k])) {
                    i_max = i;
                }
            }
            // if no pivot in i_max'th column. Pass and continue.
            if (this[i_max + this.m*k] == 0) {
                k++;
                continue;
            }
            // if i_max != h, swap the hth and i_max'th columns
            if (i_max != h) {
                det_scale *= -1; // swapping rows multiplies the determinant by -1.
                for (let j = 0; j < this.n; j++) {
                    let temp = this[i_max + this.m*j]
                    this[i_max + this.m*j] = this[h + this.m*j];
                    this[h + this.m*j] = temp;
                }
            }

            // divide the determinant by the pivot because we are about to divide the pivot row by the pivot
            det_scale /= this[h + this.m*k]

            // divide the pivot row by the pivot:
            for (let j = this.n - 1; j >= k; j--) {
                this[h + this.m*j] /= this[h + this.m*k];
            }

            for (let i = 0; i < this.m; i++) {
                if (i == h) {
                    continue;
                }
                // use rule 3 to zero-out all non-pivot entries in our pivot column
                let f = this[i + this.m*k] / this[h + this.m*k];
                for (let j = k; j < this.n; j++) {
                    this[i + this.m*j] -= this[h + this.m*j] * f;
                }                    
            }
            // increment the pivot
            h++;
            k++;
        }
        return det_scale;
    }

    /**
     * Does an inplace reduction to row echelon form using gaussian elimination. Return the coefficient by which
     * the determinant was scaled if this matrix is square.
     * See https://en.wikipedia.org/wiki/Gaussian_elimination#Pseudocode
     */
    ref() {
        let h = 0; // pivot row
        let k = 0; // pivot column
        let det_scale = 1;
        while (h < (this.m - 1) && k < this.n) {
            let i_max = h; // the row of the greatest value in our matrix in column k between rows h +1 and m - 1
            for (let i = h + 1; i < this.m; i++) {
                if (Math.abs(this[i + this.m*k]) > Math.abs(this[i_max + this.m*k])) {
                    i_max = i;
                }
            }
            if (this[i_max + this.m*k] == 0) {
                k++; // no pivot in i_max'th column. Pass and continue.
                continue;
            }
            // swap the hth and i_max'th columns
            if (i_max != h) {
                det_scale *= -1;
                for (let j = 0; j < this.n; j++) {
                    let temp = this[i_max + this.m*j];
                    this[i_max + this.m*j] = this[h + this.m*j];
                    this[h + this.m*j] = temp;
                }
            }
            // do rule 3 on all rows below h for all columns s.t. all entries in col k (below h) are zero.
            for (let i = h + 1; i < this.m; i++) {
                let f = this[i + this.m*k] / this[h + this.m*k];
                for (let j = k; j < this.n; j++) {
                    this[i + this.m*j] -= this[h + this.m*j] * f;
                }                    
            }
            // increment the pivot
            h++;
            k++;
        }
        return det_scale;
    }

    /**
     * Copys the contents of the source into this matrix.
     * @param {Array<Number>} source 
     */
    copyContents(source) {
        if (this.n*this.m != source.length) {
            throw "dimension mismatch";
        }
        for (let i = 0; i < source.length; i++) {
            this[i] = source[i];
        }
    }


     /**
     * @returns A copy of this matrix.
     */
     clone() {
        let copy = [];
        for (let i = 0; i < this.length; i++) {
            copy[i] = this[i];
        }
        return new Mat(copy, this.m, this.n);
    }

    toFloat32() {
        return new Float32Array(this);
    }

}

/**
 * Square matrix class for square matrices. Can invert, or find the determinant.
 */
class SquareMat extends Mat{
    /**
     * Set the contents of our matrix to the contents given.
     */
    constructor(contents) {
        let n = Math.trunc(Math.sqrt(contents.length));
        try{
            super(contents, n, n)
        } catch (ignored) {
            throw "contents size is not perfect square"
        }
    }

    /**
     * @param {Number} n 
     * @returns identity matrix of size n
     */
    static identity(n) {
        let res =  new SquareMat(new Array(n * n));
        res.reset();
        return res;
    }

    reset() {
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                this[j + i*this.n] = j == i ? 1 : 0;
            }
        } 
    }

    /**
     * Get a rotation matrix for theta degrees, rotating in the direction of axis b from axis a.
     * @param {Number} n The dimension of the desired rotation matrix
     * @param {Number} a Rotation source
     * @param {Number} b Rotation destination
     * @param {Number} theta Angle in radians
     */
    static rot(n, a, b, theta) {
        let rads = theta * Math.PI / 180;
        if (a > n || n > n || a < 0 || b < 0) {
            throw "axis out of bounds"
        }
        let data = [];
        let cos = Math.cos(rads);
        let sin = Math.sin(rads);
        for (let j = 0; j < n; j++) {
            for (let i = 0; i < n; i++) {
                if ((i == a && j == a) || (i == b && j == b)) {
                    data.push(cos);
                }
                else if (i == a && j == b) {
                    data.push(-sin);
                }
                else if (i == b && j == a) {
                    data.push(sin);
                }
                else if (i == j) {
                    data.push(1);
                }
                else {
                    data.push(0);
                }
            }
        }
        return new SquareMat(data);
    }

    /**
     * Multiplies two matrices
     * @param {Mat} left the matrix on the left side of the multiplication
     * @param {Mat} right the matrix on the right side of the multiplication
     * @returns The product of left and right
     */
    static mult(left, right) {
        return new SquareMat(Mat.__mult__(left, right));
    }

    /**
     * 
     * @returns the transpose of this matrix.
     */
    transpose() {
        let res = [];
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                res.push(this[j*this.n + i])
            }
        }
        return new SquareMat(res);
    }

    /**
     * @param {Array<Number>} scalar The scalars to scale by.
     * @returns a scalar matrix
     */
    static scale(scalar) {
        let data = [];
        for (let j = 0; j < scalar.length; j++) {
            for (let i = 0; i < scalar.length; i++) {
                data.push(i == j ? scalar[i] : 0);
            }
        }
        return new SquareMat(data);
    }

    /**
     * @param {Array} dir The direction to translate
     * @returns a translation matrix
     */
    static translation(dir) {
        let data = [];
        for (let j = 0; j < dir.length; j++) {
            for (let i = 0; i <= dir.length; i++) {
                data.push(i == j ? 1 : 0);
            }
        }
        data = data.concat(dir);
        data.push(1);
        return new SquareMat(data);
    }


    /**
     * 
     * @returns a n+1 x n+1 SquareMat which is this SquareMat padded with the outer row and column from an n+1 x n+1 id matrix.
     */
    padded() {
        let res = [];
        let j = 0;
        for (let i = 0; i < ((this.n+1)*(this.n+1)) - 1; i++) {
            if ((i + 1) % (this.n + 1) == 0 || i >= (this.n*(this.n+1))) {
                res.push(0)
            }
            else {
                res.push(this[j])
                j++;
            }
        }
        res.push(1)
        return new SquareMat(res);
    }


    /**
     * Calculates determinant through Gaussian Elimination and the determinant diagonal rule.
     * The determinant is the product of the diagonal in an upper triagular (aka REFed) matrix.
     * @returns The determinate of the matrix
     */
    det() {
        let refed = this.clone();
        let det = refed.ref();
        for (let i = 0; i < this.n; i++) {
            det *= refed[i + refed.n*i];
        }
        return det;
    }

    /**
     * Inverts this matrix in place using gaussian elimination. 
     * 
     * Note!! This method does NOT check that this matrix is actually invertible. Use at your own risk.
     * Behavior is undefined for singular matrices
     */
    invert() {
        // augment this matrix with an equally sized identity matrix. 
        // I know, I know... It's not a square matrix anymore. Don't worry, we'll fix it later...
        let i = 0;
        let len = this.length;
        for (let j = 0; j < len; j++) {
            if (j == i*this.n + i) {
                this.push(1);
                i++;
            } else {
                this.push(0);
            }
        }
        this.n *= 2;
        this.rref();
        // delete all 
        for (let i = 0; i < len; i++) {
            this.shift();
        }
        this.n /= 2;
    }

/**
 * @returns A copy of this square matrix.
 */
        clone() {
        let copy = [];
        for (let i = 0; i < this.length; i++) {
            copy[i] = this[i];
        }
        return new SquareMat(copy);
    }


     /** Creates a lookAt 4x4 matrix that makes an object look at the given point "to", form the given point "from".
    * "up" is optional and defines to local new up direction (rotation around z-Axis).
    * @param {Vec} from the position of the object to look from.
    * @param {Vec} to the target to look at.
    * @param {Vec} up the new up direction (default = [0,1,0]);
    * @return {SquareMat} the resulting lookAt matrix.
    */
    static lookat(from, to, up) {
        if (from.length != 3 || to.length != 3 || up.length != 3) {
            throw "lookat not defined for dims other than 3";
        }

        if (!up) {
            up = new Vec([0,1,0]);
        }
        else if (up.mag() != 1) {
            throw "up not normalized";
        }
        let res = SquareMat.identity(4);
        if (from.equals(to)) {
            res[4] = up[0];
            res[5] = up[1];
            res[6] = up[2];
            res[12] = from[0];
            res[13] = from[1];
            res[14] = from[2];
            return res;
        }

        let forward = to.clone().subtract(from);
        forward.normalize();
        if (forward.equals(up)) {
            up = forward[1] == 1 || forward[1] == -1 ? new Vec([0, 1, 0]) : new Vec([0, 0, 1]);
        }
        let right = up.cross([forward]).normalize();
        let newUp = right.cross(forward).normalize();
        res[ 0] = right[0];
        res[ 1] = right[1];
        res[ 2] = right[2];
        res[ 4] = newUp[0];
        res[ 5] = newUp[1];
        res[ 6] = newUp[2];
        res[ 8] = forward[0];
        res[ 9] = forward[1];
        res[10] = forward[2];
        res[12] = from[0];
        res[13] = from[1];
        res[14] = from[2];
        return res;
    }
}

class SquareMat3 extends SquareMat {
    constructor(data) {
        super(data);
        if (data.length != 9) {
            return "wrong size for entered matrix";
        }
    }
    static identity() {
        return new SquareMat3([1,0,0,0,1,0,0,0,1]);
    }
    /**
     * @param {Number} theta The angle to rotate in degrees
     */
    static rotx(theta) {
        return SquareMat.rot(3, 1, 2, theta);
    }
     /**
     * @param {Number} theta The angle to rotate in degrees
     */
    static roty(theta) {
        return SquareMat.rot(3, 2, 0, theta);
    }
     /**
     * @param {Number} theta The angle to rotate in degrees
     */
    static rotz(theta) {
        return SquareMat.rot(3, 0, 1, theta);
    }

     /**
     * @returns A copy of this square matrix.
     */
     clone() {
        let copy = [];
        for (let i = 0; i < this.length; i++) {
            copy[i] = this[i];
        }
        return new SquareMat(copy);
    }
}

class SquareMat4 extends SquareMat {
    constructor(data) {
        super(data);
    }
    static identity() {
        return new SquareMat4([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
    }

              /** Creates and returns a perspective matrix.
    * @param {number} fov field of view (in degrees).
    * @param {number} aspect aspect ratio of the screen.
    * @param {number} near distance of camera to the near plane.
    * @param {number} far distance of camera to the far plane.
    * @return {M4} the created perspective matrix.
    */
    static perspective(fov, near, far, aspect) {
        let result = SquareMat4.identity(); // Make new identity matrix for the result
        fov = fov * (Math.PI / 180); // convert to radians
        let f  = 1.0 / Math.tan(fov / 2);
        let nf = 1 / (near - far);

        result[ 0] = f / aspect;
        result[ 1] = 0;
        result[ 2] = 0;
        result[ 3] = 0;
        result[ 4] = 0;
        result[ 5] = f;
        result[ 6] = 0;
        result[ 7] = 0;
        result[ 9] = 0;
        result[ 8] = 0;
        result[10] = (far + near) * nf;
        result[11] = -1;
        result[12] = 0;
        result[13] = 0;
        result[14] = (2 * far * near) * nf;
        result[15] = 0;
        return result;
    }

}

/**
 * Column vector class.
 */
class Vec extends Mat{
    constructor(data){
        super(data, data.length, 1);
        this.data = data;
    }

    get x() {return this[0];}
    get y() {return this[1];}
    get z() {return this[2];}
    set x(x) {this[0] = x;}
    set y(y) {this[1] = y;}
    set z(z) {this[2] = z;}
    

    equals(otherVec) {
        if (otherVec.length != this.length) {
            return false;
        }
        for (let i = 0; i < this.length; i++) {
            if (Math.abs(this[i] - otherVec[i]) > 0.0001) {
                return false;
            }
        }
        return true;
    }

    mag() {
        return Math.sqrt(this.data.map(a => a*a).reduce((a, b) => a + b, 0));
    }

    scale(scale) {
        for (let i = 0; i < this.length; i++) {
            this[i] *= scale;
        }
    }

    normalize() {
        let mag = this.mag();
        for (let i = 0; i < this.length; i++) {
            this[i] /= mag;
        }
    }
    /**
     * Switches the direction of this vector
     */
    invert() {
        for (let i = 0; i < this.length; i++) {
            this[i] *= -1;
        }
    }
    subtract(vec) {
        for (let i = 0; i < this.length; i++) {
            this[i] -= vec[i];
        }
    }
    /**
     * @param {Array<Vec>} vecs 
     * @returns the vector cross product of this Vec with the inputted Vecs
     */
    cross(vecs) {
        let cross = [];
        for (let i = 0; i < this.length; i++) {
            let mat = [];
            for (let j = 0; j < this.length; j++) {
                mat.push(i == j ? 1 : 0);
                mat.push(this[j]);
                for (let k = 0; k < vecs.length; k++) {
                    mat.push(vecs[k][j]);
                    if (vecs[k].length != this.length) {
                        throw "cant cross vecs of different dimension"
                    }
                }
            }
            let det = new SquareMat(mat).det();
            cross.push(det)
        }
        return new Vec(cross);
    }

    /**
     * Get the angle between this vec and another vec
     * @param {Vec} otherVec 
     * @returns 
     */
    angleBetween(otherVec) {
        return Math.acos(this.dot(otherVec)) * 180/Math.PI;
    }

    dot(otherVec) {
        if (otherVec.length != this.length) {
            throw "dimension mismatch";
        }
        let res = 0;
        for (let i = 0; i < this.length; i++) {
            res += this[i] * otherVec[i];
        }
        return res;
    }

    set(data) {
        if (data.length != this.length) {
            throw "dimension mismatch"
        }
        for (let i = 0; i < this.length; i++) {
            this[i] = data[i];
        }
    }

     /**
     * @returns A copy of this vec.
     */
     clone() {
        let copy = [];
        for (let i = 0; i < this.length; i++) {
            copy[i] = this[i];
        }
        return new Vec(copy, this.length, 1);
    }
}