"use strict";
// Math extensions
Math.deg2rad = Math.PI/180.0;

//............................................
// Vector classes

/**
* Class for a 2D Vector. A V2 is also an Array of length 2, where:
* index 0 is the X component and
* index 1 is the y component
*/
class V2 extends Array{

    // These are getter functions that allow access to index 0 and 1
    // using for example:
    // let myVec2D = new V2(3,4);
    // let x = myVec2D.x; // get x component (index 0) value of myVec2D
    get x(){ return this[0];}
    get y(){ return this[1];}

    // These are setter functions that allow access to index 0 and 1
    // using for example:
    // let myVec2D = new V2(3,4);
    // myVec3D.x = 7; // set x component of myVec2D to 7
    set x(x){this[0] = x;}
    set y(y){this[1] = y;}

    // these are quick links to standard vector layouts. It is just for conveniece
    // to quickly create vector objects we often need for direction calculations.
    // example:
    // let up = V2.UP; // creates a new V2 with the values [0,1]
    static get ZERO(){ return new V2( 0.0, 0.0)};
    static get RIGHT(){return new V2( 1.0, 0.0)};
    static get LEFT(){ return new V2(-1.0, 0.0)};
    static get UP(){   return new V2( 0.0, 1.0)};
    static get DOWN(){ return new V2( 0.0,-1.0)};

    constructor(x,y){
        if(Array.isArray(x)){
            super(x[0],x[1]);
        } else {
            if(!isNaN(x) && !isNaN(y)){
                super(x,y);
            } else {
                super(0,0);
            }
        }
    }

    /** returns the magnitude of this vector.
    * @return {number} the magnitude of this vector.
    */
    magnitude(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /** returns the distance from this point to the given point v.
    * @param {V2} v the point to valculate the distance to.
    * @return {number} the distance to v.
    */
    distanceTo(v){
        let x = v.x - this.x;
        let y = v.y - this.y;
        return Math.sqrt(x * x + y * y);
    }

    /** normalizes this vector.
    * @return {V2} this vector to chain up commands.
    */
    normalize(){
        let mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
        return this;
    }

    /** sets the values x and y for this vector.
    * @param {number} x the new x value.
    * @param {number} y the new y value.
    * @return {V2} this vector to chain up commands.
    */
    set(x, y){
        this.x = x;
        this.y = y;
        return this;
    }

    /** multiplies the scalar s on this vector
    * @param {number} s value to multiply and scale the vector.
    * @return {V2} this vector to chain up commands.
    */
    multiplyScalar(s){
        this.x *= s;
        this.y *= s;
        return this;
    }

    /** calculates and returns the dot product between this vector and the vector v.
    * @param {V2} v vector to calculate the dot product with.
    * @return {number} the result of the dot product.
    */
    dot(v){
        return this.x * v.x + this.y * v.y;
    }

    /** adds another vector v on top of this vector.
    * @param {V2} v vector to add to this vector.
    * @return {V2} this vector to chain up commands.
    */
    addV(v){
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /** adds the values x and y to this vector.
    * @param {number} x x value to add.
    * @param {number} y y value to add
    * @return {V2} this vector to chain up commands.
    */
    add(x, y){
        this.x += x;
        this.y += y;
        return this;
    }

    /** subtracts another vector v from this vector.
    * @param {V2} v vector to subtract from this vector.
    * @return {V2} this vector to chain up commands.
    */
    subtractV(v){
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    /** subtracts the values x and y from this vector.
    * @param {number} x x value to subtract.
    * @param {number} y y value to subtract.
    * @return {V2} this vector to chain up commands.
    */
    subtract(x, y){
        this.x -= x;
        this.y -= y;
        return this;
    }

    /** inverts this vector (makes it face the opposite direction, but keep its length).
    * @return {V2} this vector to chain up commands.
    */
    invert(){
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    equals(v){
        if(!(v instanceof V2))
            return false;
        return this.x === v.x && this.y === v.y;
    }

    clone(){ return new V2(this.x, this.y); }

    toV3(){ return new V3(this.x, this.y, 0); }

    toFloat32(){ return new Float32Array(this);}

    toString(){ return "[" + super.toString() + "]";}
}

class V3 extends Array{

    get x(){ return this[0];}
    get y(){ return this[1];}
    get z(){ return this[2];}

    set x(x){this[0] = x;}
    set y(y){this[1] = y;}
    set z(z){this[2] = z;}

    static get ZERO(){   return new V3( 0.0, 0.0, 0.0)};
    static get RIGHT(){  return new V3( 1.0, 0.0, 0.0)};
    static get LEFT(){   return new V3(-1.0, 0.0, 0.0)};
    static get UP(){     return new V3( 0.0, 1.0, 0.0)};
    static get DOWN(){   return new V3( 0.0,-1.0, 0.0)};
    static get FORWARD(){return new V3( 0.0, 0.0, 1.0)};
    static get BACK(){   return new V3( 0.0, 0.0,-1.0)};

    constructor(x,y,z){
        if(Array.isArray(x)){
            super(x[0],x[1],x[2]);
        } else {
            if(!isNaN(x) && !isNaN(y) && !isNaN(z)){
                super(x,y,z);
            } else {
                super(0,0,0);
            }
        }
    }

    /** returns the magnitude of this vector.
    * @return {number} the magnitude of this vector.
    */
    magnitude(){
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /** returns the squared magnitude of this vector.
    * @return {number} the squared magnitude of this vector.
    */
    sqrMagnitude(){
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /** returns the distance from this point to the given point v.
    * @param {V3} v the point to valculate the distance to.
    * @return {number} the distance to v.
    */
    distanceTo(v){
        let x = v.x - this.x;
        let y = v.y - this.y;
        let z = v.z - this.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /** normalizes this vector.
    * @return {V3} this vector to chain up commands.
    */
    normalize(){
        let mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
        return this;
    }

    /** sets the values x and y for this vector.
    * @param {number} x the new x value.
    * @param {number} y the new y value.
    * @param {number} z the new z value.
    * @return {V3} this vector to chain up commands.
    */
    set(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /** multiplies the scalar s on this vector
    * @param {number} s value to multiply and scale the vector.
    * @return {V3} this vector to chain up commands.
    */
    multiplyScalar(s){
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    /** calculates and returns the dot product between this vector and the vector v.
    * @param {V3} v vector to calculate the dot product with.
    * @return {number} the result of the dot product.
    */
    dot(v){
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /** calculates and returns the cross product between this vector and the vector v (this X v).
    * @param {V3} v vector to calculate the cross product with.
    * @return {V3} the result of the cross product.
    */
    cross(v){
        return new V3( this.y*v.z - this.z*v.y,
                            this.z*v.x - this.x*v.z,
                            this.x*v.y - this.y*v.x);
    }

    /** adds another vector v on top of this vector.
    * @param {V3} v vector to add to this vector.
    * @return {V3} this vector to chain up commands.
    */
    addV(v){
        this.x += v.x;
        this.y += v.y;
        if(v.z) this.z += v.z;
        return this;
    }

    /** adds the values x, y and z to this vector.
    * @param {number} x x value to add.
    * @param {number} y y value to add
    * @param {number} z z value to add
    * @return {V3} this vector to chain up commands.
    */
    add(x, y, z){
        this.x += x;
        this.y += y;
        if(z) this.z += z;
        return this;
    }

    /** subtracts another vector v from this vector.
    * @param {V3} v vector to subtract from this vector.
    * @return {V3} this vector to chain up commands.
    */
    subtractV(v){
        this.x -= v.x;
        this.y -= v.y;
        if(v.z) this.z -= v.z;
        return this;
    }

    /** subtracts the values x, y and z from this vector.
    * @param {number} x x value to subtract.
    * @param {number} y y value to subtract.
    * @param {number} z z value to subtract.
    * @return {V3} this vector to chain up commands.
    */
    subtract(x, y, z){
        this.x -= x;
        this.y -= y;
        if(z) this.z -= z;
        return this;
    }

    /** inverts this vector (makes it face the opposite direction, but keep its length).
    * @return {V3} this vector to chain up commands.
    */
    invert(){
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    equals(v){
        if(!(v instanceof V3))
            return false;
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    clone(){ return new V3(this.x, this.y, this.z); }

    toV2(){ return new V2(this.x, this.y); }

    toFloat32(){ return new Float32Array(this);}

    toString(){ return "[" + super.toString() + "]";}
}

//............................................
// A 3 by 3 Matrix.
class M3 extends Array{

    static get IDENTITY(){
        return new M3([1,0,0,0,1,0,0,0,1]);
    }

    constructor(data){
        // make a new matrix array object with 9 (3x3) values
        super(0,0,0,0,0,0,0,0,0); // make new empty matrix
        if(data !== undefined){ // if data is given, copy into array values
            for(let i = 0; i < 9; i++){
                this[i] = data[i];
            }
        }
    }

    //....................................................................
	//Methods

    /** make a new object, that is an exact copy of this one.
    * @return {M3} the copy.
    */
    clone(){
        return new M3(this);
    }

    /** reset data back to identity.
    * @return {M3} this matrix to chain up commands.
    */
	reset(){
        for(var i=0; i < 8; i++){
	        this[i] = 0;
		}
        this[0] = this[4] = this[8] = 1; //only positions 0,4,8 need to be 1 else 0.
		return this;
	}

    /** Calculates determinant of this matrix
    * @return {number} the determinant.
    */
    determinant(){
        let a = this[0], b = this[3], c = this[6],
            d = this[1], e = this[4], f = this[7],
            g = this[2], h = this[5], i = this[8];
            // Calculate the determinant
            return a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);
            //return a*e*i + b*f*g + c*d*h - c*e*g - a*f*h - b*d*i;
    }

    toFloat32(){ return new Float32Array(this);}

    //....................................................................
	// Static Methods

    /** Creates a new transformation matrix that translates by x, y.
    * @param {number} x amount to translate on the x axis.
    * @param {number} y amount to translate on the y axis.
    * @return {M3} a new Matrix object with the resulting translation matrix.
    */
    static translationMatrix(x, y){
        let result = M3.IDENTITY;
        // and set the respective positions to the alues of x and y
        result[6] = x;
        result[7] = y;
        return result;
    }

    /** Creates a new transformation matrix that rotates by "angle" degrees.
    * If the parameter out is not defined, a new matrix is created and returned
    * @param {number} angle angle of rotion around in degrees.
    * @return {M3} a new Matrix object with the resulting rotation matrix.
    */
    static rotationMatrix(angle){
        let result = M3.IDENTITY;
        angle *= Math.deg2rad;
        result[0] = Math.cos(angle);
        result[1] = Math.sin(angle);
        result[3] = -Math.sin(angle);
        result[4] = Math.cos(angle);
        return result;
    }

    /** Creates a new transformation matrix that scales by x, y.
    * @param {number} x amount to scale on the x axis.
    * @param {number} y amount to scale on the y axis.
    * @return {M3} a new Matrix object with the resulting the resulting scale matrix.
    */
    static scaleMatrix(x, y){
        let result = M3.IDENTITY;
        result[0] = x;
        result[4] = y;
        return result;
    }

    /** Multiplies two 3x3 matrices a and b (a * b). A new M3
    * is created for the resulting produc matrix.
    * @param {M3} a the matrix to use as multiplicand.
    * @param {M3} b the matrix to use as multiplier.
    * @return {M3} a new Matrix object with the resulting product matrix.
    */
    static multM3(a, b){
        let a0 = a[0];
        let a1 = a[1];
        let a2 = a[2];
        let a3 = a[3];
        let a4 = a[4];
        let a5 = a[5];
        let a6 = a[6];
        let a7 = a[7];
        let a8 = a[8];
        let b0 = b[0];
        let b1 = b[1];
        let b2 = b[2];
        let b3 = b[3];
        let b4 = b[4];
        let b5 = b[5];
        let b6 = b[6];
        let b7 = b[7];
        let b8 = b[8];
        let result = M3.IDENTITY;
        result[0] = a0 * b0 + a3 * b1 + a6 * b2;
        result[1] = a1 * b0 + a4 * b1 + a7 * b2;
        result[2] = a2 * b0 + a5 * b1 + a8 * b2;
        result[3] = a0 * b3 + a3 * b4 + a6 * b5;
        result[4] = a1 * b3 + a4 * b4 + a7 * b5;
        result[5] = a2 * b3 + a5 * b4 + a8 * b5;
        result[6] = a0 * b6 + a3 * b7 + a6 * b8;
        result[7] = a1 * b6 + a4 * b7 + a7 * b8;
        result[8] = a2 * b6 + a5 * b7 + a8 * b8;
        return result;
    }

    /** Transforms given V3 v by given matrix m (meaning, performs a multiplication m * v).
    * Returns a new V3 object with the result.
    * @param {M3} m matrix to transform with.
    * @param {V3} v V3 to be transformed.
    * @return {V3} A new V3 with the resulting transformation.
    */
    static multV3(m, v){
        let result = new V3();
        result.x = m[0] * v.x + m[3] * v.y + m[6] * v.z;
        result.y = m[1] * v.x + m[4] * v.y + m[7] * v.z;
        result.z = m[2] * v.x + m[5] * v.y + m[8] * v.z;
        return result;
    }

    /** Transforms given V2 v by given matrix m. It is useful to have a multV2 and multV3 function,
    * since we often have 2D vectors and it would be very tedious to first convert them all into 3D
    * vectors.
    * Returns a new V2 object with the result.
    * @param {M3} m matrix to transform with.
    * @param {V2} v V2 to be transformed.
    * @return {V2}a new V3 with the resulting transformation.
    */
    static multV2(m, v){
        // We can execute a multiplication between a 3x3 matrix and a 2d vector, by
        // assuming that the z component of the vector is 1.
        let result = new V2();
        result.x = m[0] * v.x + m[3] * v.y + m[6] * 1;
        result.y = m[1] * v.x + m[4] * v.y + m[7] * 1;
        return result;
    }

    /** Inverts the given matrix m.
    * @param {M3} m the matrix to be inverted.
    * @return {M3} a new matrix with the resulting inverted values.
    */
    static invert(m){
        let d = m.determinant();
        let result = new M3();

        // function for derterminant of 2x2 matrix
        function det2(mat){ return mat[0]*mat[3]-mat[2]*mat[1]; }

        // determinants (matrix of minors)
        let a00 = [ m[4], m[7], m[5], m[8] ];
        let a01 = [ m[1], m[7], m[2], m[8] ];
        let a02 = [ m[1], m[4], m[2], m[5] ];
        let a10 = [ m[3], m[6], m[5], m[8] ];
        let a11 = [ m[0], m[6], m[2], m[8] ];
        let a12 = [ m[0], m[3], m[2], m[5] ];
        let a20 = [ m[3], m[6], m[4], m[7] ];
        let a21 = [ m[0], m[6], m[1], m[7] ];
        let a22 = [ m[0], m[3], m[1], m[4] ];

        result[0] = det2(a00)/d;
        result[1] = -det2(a01)/d;
        result[2] = det2(a02)/d;
        result[3] = -det2(a10)/d;
        result[4] = det2(a11)/d;
        result[5] = -det2(a12)/d;
        result[6] = det2(a20)/d;
        result[7] = -det2(a21)/d;
        result[8] = det2(a22)/d;
        return result;
    }

    /** Transposes the given matrix m.
    * @param {M3} m the matrix to be transposed.
    * @return {M3} a new matrix with the resulting transposed values.
    */
    static transpose(m){
        let result = new M3();
        result[1] = m[3];
        result[2] = m[6];
        result[3] = m[1];
        result[5] = m[7];
        result[6] = m[2];
        result[7] = m[5];
        return result;
    }

    toString(){ return "[" + super.toString() + "]";}
}

//............................................
// 4x4 Matrix class
class M4 extends Array{

    static get IDENTITY(){
        return new M4([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
    }

    constructor(data){
        // make a new matrix array object with 16 (4x4) values
        super(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0); // make new empty matrix
        if(data !== undefined){ // if data is given, copy into array values
            for(let i = 0; i < 16; i++){
                this[i] = data[i];
            }
        }
    }

    //....................................................................
    //Methods

    //reset data back to identity.
    reset(){
        for(var i=0; i < this.length; i++){
            this[i] = (i % 5 == 0)? 1 : 0; //only positions 0,5,10,15 need to be 1 else 0.
        }
        return this;
    }

    //Bring the matrix back to identity without changing the transform values.
    resetRotation(){
        for(var i=0; i < 12; i++){
            this[i] = 0;
        }
        //only positions 0,5,10,15 need to be 1 else 0.
        this[0] = this[5] = this[10] = this[15] = 1;
        return this;
    }

    clone(){ return new M4(this);}

    toString(){ return "[" + this.toString() + "]";}

    toFloat32(){ return new Float32Array(this);}

    //....................................................................
    // Static methods to generate matrices

    /** Creates and returns a perspective matrix.
    * @param {number} fovy field of view (in degrees).
    * @param {number} aspect aspect ratio of the screen.
    * @param {number} near distance of camera to the near plane.
    * @param {number} far distance of camera to the far plane.
    * @return {M4} the created perspective matrix.
    */
    static perspective(fov, near, far, aspect) {
        let result = M4.IDENTITY; // Make new identity matrix for the result
        fov = fov * Math.deg2rad;
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

    /** Creates and returns a orthographic matrix.
    * @param {number} left distance to left boarder of camera view.
    * @param {number} right distance to right boarder of camera view.
    * @param {number} bottom distance to bottom boarder of camera view.
    * @param {number} top distance to top boarder of camera view.
    * @param {number} near distance of camera to the near plane.
    * @param {number} far distance of camera to the far plane.
    * @return {M4} the created orthographic matrix.
    */
    static ortho(left, right, bottom, top, near, far) {
        let result = M4.IDENTITY; // Make new identity matrix for the result

        let lr = 1 / (left - right);
        let bt = 1 / (bottom - top);
        let nf = 1 / (near - far);

        result[ 0] = -2 * lr;
        result[ 1] = 0;
        result[ 2] = 0;
        result[ 3] = 0;
        result[ 4] = 0;
        result[ 5] = -2 * bt;
        result[ 6] = 0;
        result[ 7] = 0;
        result[ 8] = 0;
        result[ 9] = 0;
        result[10] = 2 * nf;
        result[11] = 0;
        result[12] = (left + right) * lr;
        result[13] = (top + bottom) * bt;
        result[14] = (far + near) * nf;
        result[15] = 1;
        return result;
    };

    /** Creates a transformation matrix that translates by x, y, z.
    * @param {number} x amount to translate on the x axis.
    * @param {number} y amount to translate on the y axis.
    * @param {number} z amount to translate on the z axis.
    * @return {M4} the resulting transformation matrix.
    */
    static translationMatrix(x,y,z) {
        let result = M4.IDENTITY; // Make new identity matrix for the result

        result[12] = x;
        result[13] = y;
        result[14] = z;
        return result;
    };

    /** Creates a transformation matrix that scales by x, y, z.
    * @param {number} x amount to scale on the x axis.
    * @param {number} y amount to scale on the y axis.
    * @param {number} z amount to scale on the z axis.
    * @return {M4} the resulting transformation matrix.
    */
    static scaleMatrix(x,y,z) {
        let result = M4.IDENTITY; // Make new identity matrix for the result

        result[ 0] = x;
        result[ 5] = y;
        result[10] = z;
        return result;
    };

    /** Creates a transformation matrix that rotates on the X axis by "angle" degrees.
    * @param {number} angle angle of rotion around the X axis in degrees.
    * @return {M4} the resulting transformation matrix.
    */
    static rotationMatrixX(angle) {
        let rad = angle * Math.deg2rad;
        let result = M4.IDENTITY; // Make new identity matrix for the result

        let s = Math.sin(rad),
            c = Math.cos(rad);

        result[ 5] = c;
        result[ 6] = s;
        result[ 9] =-s;
        result[10] = c;
        return result;
    }

    /** Creates a transformation matrix that rotates on the Y axis by "angle" degrees.
    * @param {number} angle angle of rotion around the Y axis in degrees.
    * @return {M4} the resulting transformation matrix.
    */
    static rotationMatrixY(angle) {
        let rad = angle * Math.deg2rad;
        let result = M4.IDENTITY; // Make new identity matrix for the result

        let s = Math.sin(rad),
            c = Math.cos(rad);
        result[ 0] = c;
        result[ 2] =-s;
        result[ 8] = s;
        result[10] = c;
        return result;
    }

    /** Creates a transformation matrix that rotates on the Z axis by "angle" degrees.
    * @param {number} angle angle of rotion around the Z axis in degrees.
    * @return {M4} the resulting transformation matrix.
    */
    static rotationMatrixZ(angle) {
        let rad = angle * Math.deg2rad;
        let result = M4.IDENTITY; // Make new identity matrix for the result

        let s = Math.sin(rad),
            c = Math.cos(rad);
        result[0] = c;
        result[1] = s;
        result[4] =-s;
        result[5] = c;
        return result;
    }

    /** Creates a rotation matrix that rotates on the rad angles around the axis a.
    * src: https://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle
    * @param {number} angle angle of rotion around the given axis in degrees.
    * @param {V3} axis the axis to rotate around.
    * @return {M4} the resulting transformation matrix.
    */
    static rotationMatrixAxis(angle, axis) {
        let rad = angle * Math.deg2rad;
        let result = M4.IDENTITY; // Make new identity matrix for the result

        axis.normalize();
        let s = Math.sin(rad),
            c = Math.cos(rad),
            x = axis.x,
            y = axis.y,
            z = axis.z;

        // no idea how this works, I gues wikipedia can explain it?
        result[ 0] = c + x*x*(1-c);
        result[ 1] = y*x*(1-c) + z*s;
        result[ 2] = z*x*(1-c) - y*s;

        result[ 4] = x*y*(1-c) - z*s;
        result[ 5] = c + y*y*(1-c);
        result[ 6] = z*y*(1-c) + x*s;

        result[ 8] = x*z*(1-c) + y*s;
        result[ 9] = y*z*(1-c) - x*s;
        result[10] = c + z*z*(1-c);
        return result;
    }



    /** Creates a lookAt 4x4 matrix that makes an object look at the given point "to", form the given point "from".
    * "up" is optional and defines to local new up direction (rotation around z-Axis).
    * @param {V3} from the position of the object to look from.
    * @param {V3} to the target to look at.
    * @param {V3} up the new up direction (default = [0,1,0]);
    * @return {M4} the resulting lookAt matrix.
    */
    static lookAtMatrix(from, to, up) {
        let result = M4.IDENTITY; // Make new identity matrix for the result
        if(!up)  up = new V3(0, 1, 0);

        if(from.equals(to)){
            result[ 4] = up.x;
            result[ 5] = up.y;
            result[ 6] = up.z;
            result[12] = from.x;
            result[13] = from.y;
            result[14] = from.z;
            return result;
        }

        let forward = from.clone().subtractV(to).normalize();

        if(forward.equals(up) || forward.equals(up.clone().invert())){
            if(forward.y == 1 || forward.y == -1){
                up = V3.FORWARD;
            } else {
                up = V3.UP;
            }
        }
        
        let right = up.clone().cross(forward).normalize();
        let newUp = forward.clone().cross(right).normalize();

        // assemble matrix from basis vectors
        result[ 0] = right.x;
        result[ 1] = right.y;
        result[ 2] = right.z;
        result[ 4] = newUp.x;
        result[ 5] = newUp.y;
        result[ 6] = newUp.z;
        result[ 8] = forward.x;
        result[ 9] = forward.y;
        result[10] = forward.z;
        result[12] = from.x;
        result[13] = from.y;
        result[14] = from.z;
        return result;
    }

    //....................................................................
    // Static methods to operate with matrices

    /** Transposes the matrix.
    * @param {M4} m the matrix to transpose (remains unchanged).
    * @return {M4} a new matrix, containing the transposed values.
    */
    static transpose(m) {
        let result = M4.IDENTITY; // Make new identity matrix for the result
        result[ 0] = m[ 0];
        result[ 1] = m[ 4];
        result[ 2] = m[ 8];
        result[ 3] = m[12];
        result[ 4] = m[ 1];
        result[ 5] = m[ 5];
        result[ 6] = m[ 9];
        result[ 7] = m[13];
        result[ 8] = m[ 2];
        result[ 9] = m[ 6];
        result[10] = m[10];
        result[11] = m[14];
        result[12] = m[ 3];
        result[13] = m[ 7];
        result[14] = m[11];
        result[15] = m[15];
        return result;
    }

    /** Creates a 3x3 Matrix that contains the inverse of the transpose of the
    * given 4x4 Matrix. Used to transform normals for example for lighting and shading.
    * @param {M4} m the matrix to use as source.
    * @return {Matrix3x3} the created 3x3 inverse transpose of the given matrix m.
    */
    static inverseTranspose3x3(m) {
        let result = M3.IDENTITY;

        let m00 = m[ 0], m10 = m[ 4], m20 = m[ 8], m30 = m[12];
        let m01 = m[ 1], m11 = m[ 5], m21 = m[ 9], m31 = m[13];
        let m02 = m[ 2], m12 = m[ 6], m22 = m[10], m32 = m[14];
        let m03 = m[ 3], m13 = m[ 7], m23 = m[11], m33 = m[15];

        let b00 = m00 * m11 - m01 * m10;
        let b01 = m00 * m12 - m02 * m10;
        let b02 = m00 * m13 - m03 * m10;
        let b03 = m01 * m12 - m02 * m11;
        let b04 = m01 * m13 - m03 * m11;
        let b05 = m02 * m13 - m03 * m12;
        let b06 = m20 * m31 - m21 * m30;
        let b07 = m20 * m32 - m22 * m30;
        let b08 = m20 * m33 - m23 * m30;
        let b09 = m21 * m32 - m22 * m31;
        let b10 = m21 * m33 - m23 * m31;
        let b11 = m22 * m33 - m23 * m32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) return null;

        det = 1.0 / det;

        result[0] = (m11 * b11 - m12 * b10 + m13 * b09) * det;
        result[1] = (m12 * b08 - m10 * b11 - m13 * b07) * det;
        result[2] = (m10 * b10 - m11 * b08 + m13 * b06) * det;

        result[3] = (m02 * b10 - m01 * b11 - m03 * b09) * det;
        result[4] = (m00 * b11 - m02 * b08 + m03 * b07) * det;
        result[5] = (m01 * b08 - m00 * b10 - m03 * b06) * det;

        result[6] = (m31 * b05 - m32 * b04 + m33 * b03) * det;
        result[7] = (m32 * b02 - m30 * b05 - m33 * b01) * det;
        result[8] = (m30 * b04 - m31 * b02 + m33 * b00) * det;
        return result;
    }

    /**  Multiplies a 4x4 matrix on a 3D Vector. The missing w component of the vector is assumed to be 1.
    * @param {M4} m the matrix to use for the transformation.
    * @param {V3} v the vector to transform.
    * @return {V3} the transformed vector.
    */
    static multV3(m, v) {
        let result = new V3();
        let x = v.x,
            y = v.y,
            z = v.z;
        result.x = m[0] * x + m[4] * y + m[ 8] * z + m[12];
        result.y = m[1] * x + m[5] * y + m[ 9] * z + m[13];
        result.z = m[2] * x + m[6] * y + m[10] * z + m[14];
        return result;
    }

    /** Multiplies two 4x4 matrices a and b (a * b).
    * @param {M4} a the matrix to use as multiplicand.
    * @param {M4} b the matrix to use as multiplier.
    * @return {M4} A new matrix, containing the resulting product matrix.
    */
    static multM4(a, b){
        let result = M4.IDENTITY; // Make new identity matrix for the result

        // a[column][row]
        let a00 = a[0], a10 = a[4], a20 = a[ 8], a30 = a[12],
            a01 = a[1], a11 = a[5], a21 = a[ 9], a31 = a[13],
            a02 = a[2], a12 = a[6], a22 = a[10], a32 = a[14],
            a03 = a[3], a13 = a[7], a23 = a[11], a33 = a[15];
        let b00 = b[0], b10 = b[4], b20 = b[ 8], b30 = b[12],
            b01 = b[1], b11 = b[5], b21 = b[ 9], b31 = b[13],
            b02 = b[2], b12 = b[6], b22 = b[10], b32 = b[14],
            b03 = b[3], b13 = b[7], b23 = b[11], b33 = b[15];

        result[0] = a00*b00 + a10*b01 + a20*b02 + a30*b03;
        result[1] = a01*b00 + a11*b01 + a21*b02 + a31*b03;
        result[2] = a02*b00 + a12*b01 + a22*b02 + a32*b03;
        result[3] = a03*b00 + a13*b01 + a23*b02 + a33*b03;

        result[4] = a00*b10 + a10*b11 + a20*b12 + a30*b13;
        result[5] = a01*b10 + a11*b11 + a21*b12 + a31*b13;
        result[6] = a02*b10 + a12*b11 + a22*b12 + a32*b13;
        result[7] = a03*b10 + a13*b11 + a23*b12 + a33*b13;

        result[ 8] = a00*b20 + a10*b21 + a20*b22 + a30*b23;
        result[ 9] = a01*b20 + a11*b21 + a21*b22 + a31*b23;
        result[10] = a02*b20 + a12*b21 + a22*b22 + a32*b23;
        result[11] = a03*b20 + a13*b21 + a23*b22 + a33*b23;

        result[12] = a00*b30 + a10*b31 + a20*b32 + a30*b33;
        result[13] = a01*b30 + a11*b31 + a21*b32 + a31*b33;
        result[14] = a02*b30 + a12*b31 + a22*b32 + a32*b33;
        result[15] = a03*b30 + a13*b31 + a23*b32 + a33*b33;
        return result;
    }

    /** Inverts the given matrix m. If out is defined the result is stored in out, else the
    * given matrix m will be overwritten with its inverse.
    * @param {M4} m the matrix to be inverted, if out is not defined, will recieve the result.
    * @param {M4} out the matrix to store the outcome, if not defined, outcome will be stored in m.
    * @return {M4} the resulting inverted matrix.
    */
    static invert(m) {
        let result = M4.IDENTITY;
        var a00 = m[0], a10 = m[4], a20 = m[ 8], a30 = m[12],
            a01 = m[1], a11 = m[5], a21 = m[ 9], a31 = m[13],
            a02 = m[2], a12 = m[6], a22 = m[10], a32 = m[14],
            a03 = m[3], a13 = m[7], a23 = m[11], a33 = m[15],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,

            // Calculate the determinant
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) return false;
        det = 1.0 / det;

        result[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        result[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        result[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        result[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;

        result[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        result[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        result[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        result[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;

        result[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        result[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        result[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        result[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;

        result[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        result[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        result[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        result[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return result;
    }
}
