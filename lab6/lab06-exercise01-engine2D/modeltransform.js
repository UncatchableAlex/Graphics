"use strict";

class ModelTransform{
    /**
    * Creates an instance of ModelTransform.
    * @param {Object} mesh the mesh data of this model, eg. vertices, positions, etc.
    * @param {Object} material material data for this model, eg. color and textures.
    * @param {Vector2} position the center of the model in world space.
    * @param {float} rotation the center of the model (in degrees).
    * @param {Vector2} scale width and height of the model.
    */
    constructor(mesh, material, position, rotation, scale){

        this.mesh = mesh;
        this.material = material;

        // set properties of transform (clone vectors to avoid accidental referencing)
        // if position, rotation and scale are not provided in the constructor
        // (are undefined), we simply set them to default values.
        if(position){ this.position = position.clone();}
        else {        this.position = new V2();}

        if(rotation){ this.rotation = rotation;}
        else {        this.rotation = 0;}

        if(scale){ this.scale = scale.clone();}
        else {     this.scale = new V2(1,1);}

        // create and initialize Matrix
        this.modelMatrix = new M3();
        this.updateMatrix();
	}

    // for now we just need to update the modelMatrix, but other models in
    // the future need more update logic.
    update(){
        this.updateMatrix();
    }

    updateMatrix(){
        this.modelMatrix.reset(); // we reset the matrix first and then calculate the new matrix from position, rotation and scale.

        let tMatrix = M3.translationMatrix(this.position.x, this.position.y);
        let rMatrix = M3.rotationMatrix(this.rotation);
        let sMatrix = M3.scaleMatrix(this.scale.x, this.scale.y);

        let rtMatrix = M3.multM3(tMatrix, rMatrix);
        let srtMatrix = M3.multM3(rtMatrix, sMatrix);
        this.modelMatrix = srtMatrix;
    }

    // The base Vectors i and j of our 3x3 model matrix can be extracted to give us
    // the local upwards and right direction of the model (its local X and Y axis in the world).
    // This is useful to perform for example movement operations on the transform.
    get localRight(){ return new V2(this.modelMatrix[0],this.modelMatrix[1]);}
    get localUp(){    return new V2(this.modelMatrix[3],this.modelMatrix[4]);}

    reset(){
        this.position.set(0,0);
        this.scale.set(1,1);
        this.rotation = 0;
        this.modelMatrix.reset();
        return this;
    }
};
