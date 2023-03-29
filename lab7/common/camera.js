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

        this.cameraMatrix = new M4();
        this.viewMatrix = new M4();
        this.projectionMatrix = new M4();
        this.updateProjectionMatrix(fov, near, far, aspectRatio);
    }

    /** Sets the camera matrix to tranlate to "position" with the target orientation of "rotation".
    * @param {position} V3 the new position of the camera.
    * @param {rotation} V3 the new rotation of the camera.
    */
    setPositionRotation(position, rotation){
        this.cameraMatrix = M4.translationMatrix(position.x,position.y,position.z);
        this.cameraMatrix = M4.multM4(this.cameraMatrix, M4.rotationMatrixY(rotation.y));
        this.cameraMatrix = M4.multM4(this.cameraMatrix, M4.rotationMatrixX(rotation.x));
        this.cameraMatrix = M4.multM4(this.cameraMatrix, M4.rotationMatrixZ(rotation.z));

        this.viewMatrix = M4.invert(this.cameraMatrix);
    }

    /** Sets the camera matrix to tranlate to "position" with the new orientation,
    * that makes the camera look at "target" with the upwards orientation (roll) of "up".
    * @param {position} V3 the new position of the camera.
    * @param {target} V3 the target the camera should look at.
    * @param {up} V3 the relative upwards direction of the camera.
    */
    lookAt(position, target, up){
        if(!up) up = V3.UP;
        this.cameraMatrix = M4.lookAtMatrix(position, target, up);
        this.viewMatrix = M4.invert(this.cameraMatrix);
    }

    /** Updates the perspectie matrix of the camera with the new values
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
        this.projectionMatrix = M4.perspective(this.fov, this.near, this.far, this.aspectRatio);
        return this.projectionMatrix;
    }

    /** Gets the camera world position from the camera matrix.
    * @return {Vector3} the camera world position.
    */
    getPosition(){
        return new V3(this.cameraMatrix[12],this.cameraMatrix[13],this.cameraMatrix[14]);
    }

    /** Gets the camera world view direction.
    * @return {Vector3} the camera world view direction.
    */
    getViewDir(){
        return new V3(-this.cameraMatrix[8],-this.cameraMatrix[9],-this.cameraMatrix[10]);
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
    * @param {number} tartingYaw yaw of the camera when starting.
    */
    constructor(canvas, camera, target, distance, zoomSpeed, rotationSpeed, movementSpeed, startingPitch, tartingYaw){
        this.canvas = canvas;
        this.camera = camera;
        this.target = target || V3.ZERO;
        this.distance = distance || 5;
        this.zoomSpeed = zoomSpeed || 500;
        this.rotationSpeed = rotationSpeed || 200;
        this.movementSpeed = movementSpeed || 10;
        this.pitch = startingPitch || -25
        this.yaw = tartingYaw || 0;
        this.offsetY = 0;
    }

    /** Updates the controller and the camera matrix of the controlled camera.
    * Call during update phase.
    */
    update(){
        if(Input.mouseButtonHold()){
            this.yaw += Input.mousePositionDelta.x * (this.rotationSpeed / this.canvas.height);    // make rotationspeed the same, no matter the height.
            // move up and down when shift is pressed, else
            if(Input.keyHold("shift")){
                this.offsetY += Input.mousePositionDelta.y * (this.movementSpeed / this.canvas.height);
            } else {
                this.pitch += Input.mousePositionDelta.y * (this.rotationSpeed / this.canvas.height);
            }
        }
        this.distance += Input.mouseWheelDelta * (this.zoomSpeed / this.canvas.height) * (this.distance/3);

        this.camera.cameraMatrix = M4.translationMatrix(this.target.x ,this.offsetY + this.target.y, this.target.z);
        this.camera.cameraMatrix = M4.multM4(this.camera.cameraMatrix, M4.rotationMatrixY(this.yaw));
        this.camera.cameraMatrix = M4.multM4(this.camera.cameraMatrix, M4.rotationMatrixX(this.pitch));
        this.camera.cameraMatrix = M4.multM4(this.camera.cameraMatrix, M4.translationMatrix(0,0,this.distance));

        this.camera.viewMatrix = M4.invert(this.camera.cameraMatrix);
    }
}
