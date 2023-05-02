"use strict";

/** A Perspective Camera to render 3D geometry
*/
class PerspectiveCamera {

    /** Creates a new PerspectiveCamera object
    * @param {number} fov the field of view of the camera, default 45 degrees.
    * @param {number} near distance to the near plane of the camera frustum, default 0.1.
    * @param {number} far distance to the far plane of the camera frustum, default 1000.
    * @param {number} aspectRatio aspect ratio of the target canvas/screen.
    */
    constructor(fov, near, far, aspectRatio){
        this.aspectRatio = aspectRatio || gl.canvas.width / gl.canvas.height;
        this.fov = fov || 45.0;
        this.near = near || 0.1;
        this.far = far || 1000.0;

        this.cameraMatrix = SquareMat4.identity();
        this.viewMatrix = SquareMat4.identity();
        this.projectionMatrix = SquareMat4.identity();
        this.updateProjectionMatrix(fov, near, far, aspectRatio);
    }

    /** Sets the camera matrix to tranlate to "position" with the target orientation of "rotation".
    * @param {position} V3 the new position of the camera.
    * @param {rotation} V3 the new rotation of the camera.
    */
    setPositionRotation(position, rotation){
        this.cameramatrix = SquareMat.translation(position);
        let rot = SquareMat3.identity();
        rot.roty(rotation.y);
        rot.rotx(rotation.x);
        rot.rotz(rotation.z);
        this.cameraMatrix = this.cameraMatrix.rightMult(rot.padded());
        let invMat = this.cameraMatrix.clone();
        invMat.invert();
        this.viewMatrix.copyContents(invMat);
    }

    /** Sets the camera matrix to tranlate to "position" with the new orientation,
    * that makes the camera look at "target" with the upwards orientation (roll) of "up".
    * @param {position} V3 the new position of the camera.
    * @param {target} V3 the target the camera should look at.
    * @param {up} V3 the relative upwards direction of the camera.
    */
    lookAt(position, target, up){
        if(!up) up = Vec([0, 1, 0]);
        this.cameraMatrix = SquareMat.lookAtMatrix(position, target, up);
        let invMat = this.cameraMatrix.clone();
        invMat.invert();
        this.viewMatrix.copyContents(invMat);    }

    /** Updates the perspective matrix of the camera with the new values
    * @param {number} fov the field of view of the camera, default 45 degrees.
    * @param {number} near distance to the near plane of the camera frustum, default 0.1.
    * @param {number} far distance to the far plane of the camera frustum, default 1000.
    * @param {number} aspectRatio aspect ratio of the target canvas/screen.
    */
    updateProjectionMatrix(fov, near, far, aspectRatio){
        // use new values if supplied, or old values if already present, or default values
        this.aspectRatio = aspectRatio || gl.canvas.width / gl.canvas.height;
        this.fov = fov || this.fov || 45.0;
        this.near = near || this.near || 0.1;
        this.far = far || this.far || 1000.0;
        this.projectionMatrix = SquareMat4.perspective(this.fov, this.near, this.far, this.aspectRatio);
        return this.projectionMatrix;
    }

    /** Gets the camera world position from the camera matrix.
    * @return {Vector3} the camera world position.
    */
    getPosition(){
        return new Vec([this.cameraMatrix[12],this.cameraMatrix[13],this.cameraMatrix[14]]);
    }

    /** Gets the camera world view direction.
    * @return {Vector3} the camera world view direction.
    */
    getViewDir(){
        return new Vec([-this.cameraMatrix[8],-this.cameraMatrix[9],-this.cameraMatrix[10]]);
    }
}

/** A Controller that will use mouse input to move a 3D camera around a set target.
*/
class OrbiterCameraController {
    canvas;
    camera;         // the camera to be controlled.
    target;         // the point the camera should orbit around.
    distance;       // distance of the camera to the target.
    zoomSpeed;      // speed to zoom in/out with the mousewheel
    rotationSpeed;  // speed to orbit around the target when moving the mouse.
    movementSpeed;  // speed to move up and down when holding "shift".
    pitch;          // current pitch of the camera.
    yaw;            // current yaw of the camera.
    offsetY;        // current height offset to the target of the camera.

    /** Creates a new OrbiterCameraController object
    * @param {Canvas} canvas the canvas the camera draws on.
    * @param {PerspectiveCamera} camera the camera to be controlled by this controller.
    * @param {V3} target the point the camera should orbit around.
    * @param {number} distance distance of the camera to the target.
    * @param {number} zoomSpeed speed to zoom in/out with the mousewheel
    * @param {number} rotationSpeed speed to orbit around the target when moving the mouse.
    * @param {number} movementSpeed speed to move up and down when holding "shift".
    * @param {number} startingPitch pitch of the camera when starting.
    * @param {number} startingYaw yaw of the camera when starting.
    */
    constructor(canvas, camera, target, distance, zoomSpeed, rotationSpeed, movementSpeed, startingPitch, startingYaw){
        this.canvas = canvas;
        this.camera = camera;
        this.target = target || new Vec([0,0,0]);
        this.distance = distance || 5;
        this.zoomSpeed = zoomSpeed || 500;
        this.rotationSpeed = rotationSpeed || 100;
        this.movementSpeed = movementSpeed || 10;
        this.pitch = startingPitch || -25
        this.yaw = startingYaw || 0;
        this.offsetY = 0;
        this.forward = new Vec([0, -1]); // pointing toward -z
    }

    /** Updates the controller and the camera matrix of the controlled camera.
    * Call during update phase.
    */
    update(){
        if (!Input.keyHold('shift')) {
            this.yaw += Input.mousePositionDelta.x * (this.rotationSpeed / this.canvas.height);    // make rotationspeed the same, no matter the height.
            this.pitch += Input.mousePositionDelta.y * (this.rotationSpeed / this.canvas.height);
        }
        else {
            let a = 3;
        }
        let rads = this.yaw * Math.PI/180;
        let distPerFrame = 0.03;
        this.forward[0] = Math.sin(rads);
        this.forward[1] = Math.cos(rads);
       // let forward = 
        if (Input.keyHold('w')) {
            this.target.x -= this.forward[0] * distPerFrame;
            this.target.z -= this.forward[1] * distPerFrame;
        }
        if (Input.keyHold('s')) {
            this.target.x += this.forward[0] * distPerFrame;
            this.target.z += this.forward[1] * distPerFrame;
        }
        if (Input.keyHold('a')) {
            this.target.z += this.forward[0] * distPerFrame;
            this.target.x += -this.forward[1] * distPerFrame;
        }
        if (Input.keyHold('d')) {
            this.target.z += -this.forward[0] * distPerFrame;
            this.target.x += this.forward[1] * distPerFrame;
        }

        this.camera.cameraMatrix = SquareMat.translation([this.target.x, this.offsetY + this.target.y, this.target.z]);
        this.camera.cameraMatrix = Mat.mult(this.camera.cameraMatrix, SquareMat3.roty(this.yaw).padded());
        this.camera.cameraMatrix = Mat.mult(this.camera.cameraMatrix, SquareMat3.rotx(this.pitch).padded());
        this.camera.cameraMatrix = Mat.mult(this.camera.cameraMatrix, SquareMat.translation([0,0,this.distance]));

        this.camera.viewMatrix = this.camera.cameraMatrix.clone();
        this.camera.viewMatrix.invert();
     }
}
