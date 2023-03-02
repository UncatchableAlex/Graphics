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
