"use strict";
class ModelTransform{
    /**
    * Creates an instance of ModelTransform.
    * @param {Object} mesh the mesh data of this model, eg. vertices, positions, etc.
    * @param {Object} material material data for this model, eg. color and textures.
    * @param {Vector3} position the center of the model in world space.
    * @param {Vector3} rotation the rotation of the model (in degrees: x,y,z -> pitch,yaw,roll).
    * @param {Vector3} scale width, height and depth of the model (base is 1/1/1).
    */
    constructor(mesh, material, position, rotation, scale){

        this.mesh = mesh;
        this.material = material;

        // set properties of transform (clone vectors to avoid accidental referencing)
        // if position, rotation and scale are not provided in the constructor
        // (are undefined), we simply set them to default values.
        if(position){ this.position = position.clone();}
        else {        this.position = new Vec([0, 0, 0]);}

        if(rotation){ this.rotation = rotation;}
        else {        this.rotation = new Vec([0, 0, 0]);}

        if(scale){ this.scale = scale.clone();}
        else {     this.scale = new Vec([1,1,1]);}

        // create and initialize Matrix
        this.modelMatrix = SquareMat4.identity();
        this.updateMatrix();
	}

    //...................................................
	//Methods
    //...................................................
	update(){
		this.updateMatrix();
		return this;
	}

    updateMatrix(){
        this.modelMatrix = SquareMat.translation([this.position.x,this.position.y,this.position.z]);
        this.modelMatrix = Mat.mult(this.modelMatrix, SquareMat3.roty(this.rotation.y).padded());
        this.modelMatrix = Mat.mult(this.modelMatrix, SquareMat3.rotx(this.rotation.x).padded());
        this.modelMatrix = Mat.mult(this.modelMatrix, SquareMat3.rotz(this.rotation.z).padded());
        this.modelMatrix = Mat.mult(this.modelMatrix, SquareMat.scale([this.scale.x,this.scale.y,this.scale.z, 1]));
    }

    // The base Vectors i,j and k of our 4x4 model matrix can be extracted to give us
    // the local right, upwards and forward direction of the model (its local X, Y and Z axis in the world).
    // This is useful to perform for example movement operations on the transform.
    get localRight(){ return new Vec(this.modelMatrix[0],this.modelMatrix[1],this.modelMatrix[2]);}
    get localUp(){    return new Vec(this.modelMatrix[3],this.modelMatrix[4],this.modelMatrix[5]);}
    get localForward(){    return new Vec(this.modelMatrix[6],this.modelMatrix[7],this.modelMatrix[8]);}

    reset(){
        this.position.set([0,0,0]);
        this.scale.set([1,1,1]);
        this.rotation.set([0,0,0]);
        this.modelMatrix.reset();
        return this;
    }
}
