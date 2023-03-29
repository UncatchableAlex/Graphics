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
        else {        this.position = new V3();}

        if(rotation){ this.rotation = rotation;}
        else {        this.rotation = new V3();}

        if(scale){ this.scale = scale.clone();}
        else {     this.scale = new V3(1,1,1);}

        // create and initialize Matrix
        this.modelMatrix = new M4();
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
        this.modelMatrix.reset(); // we reset the matrix first and then calculate the new matrix from position, rotation and scale.

        this.modelMatrix = M4.translationMatrix(this.position.x,this.position.y,this.position.z);
        this.modelMatrix = M4.multM4(this.modelMatrix, M4.rotationMatrixY(this.rotation.y));
        this.modelMatrix = M4.multM4(this.modelMatrix, M4.rotationMatrixX(this.rotation.x));
        this.modelMatrix = M4.multM4(this.modelMatrix, M4.rotationMatrixZ(this.rotation.z));
        this.modelMatrix = M4.multM4(this.modelMatrix, M4.scaleMatrix(this.scale.x,this.scale.y,this.scale.z));
    }

    // The base Vectors i,j and k of our 4x4 model matrix can be extracted to give us
    // the local right, upwards and forward direction of the model (its local X, Y and Z axis in the world).
    // This is useful to perform for example movement operations on the transform.
    get localRight(){ return new V3(this.modelMatrix[0],this.modelMatrix[1],this.modelMatrix[2]);}
    get localUp(){    return new V3(this.modelMatrix[4],this.modelMatrix[5],this.modelMatrix[6]);}
    get localForward(){    return new V3(this.modelMatrix[8],this.modelMatrix[9],this.modelMatrix[10]);}

    reset(){
        this.position.set(0,0,0);
        this.scale.set(1,1,1);
        this.rotation.set(0,0,0);
        this.modelMatrix.reset();
        return this;
    }
}
