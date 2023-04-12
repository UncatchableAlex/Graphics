"use strict";
/*
EXAMPLE:
var renderLoop = new RenderLoop(function(deltaTime){
	console.log(rloop.fps + " " + deltaTime);
},10).start();
*/

// the Time object will allow easy access to time based values, such as
// deltaTime and time since application start.
var Time = {};
Time.deltaTime = 0;
Time.time = 0;

// A simple render loop, after calling start() the callback function will be called
// "fps"- many times a second with a deltaTime (time between two frames) parameter.
class RenderLoop{
	constructor(callback,displayStats=true,fps=60){

        this.stats = {
            fps: new Stats(),
            memmory: new Stats()
        };
        this.stats.fps.domElement.style.cssText = 'position:absolute;top:0px;left:0px;';
        document.body.appendChild(this.stats.fps.domElement);
        this.stats.memmory.domElement.style.cssText = 'position:absolute;top:0px;left:80px;';
        document.body.appendChild(this.stats.memmory.domElement);
        this.displayStats = displayStats;
        if(displayStats){
            this.stats.memmory.showPanel(2); // Panel 2 = memory
            this.stats.fps.showPanel(0); // Panel 0 = fps
        }else{
            this.stats.fps.domElement.style.visibility = "hidden";
            this.stats.memmory.domElement.style.visibility = "hidden";
        }

		let oThis = this;           //Keep track of this object also in other scopes (eg. callbacks)
		this.msLastFrame= null;		//The time in Miliseconds of the last frame.
		this.callBack 	= callback;	//What function to call for each frame
		this.isActive 	= false;	//Control the On/Off state of the render loop
		this.targetFps 	= fps;		//Save the value of how fast the loop is going.

		this.fpsLimit = 1000/fps; //Calc how many milliseconds per frame in one second of time.

		this.run = function(){

			//Calculate Deltatime between frames and the FPS currently.
			let msCurrent	= performance.now();	//Gives you the whole number of how many milliseconds since the dawn of time :)
			let	sDelta		= (msCurrent - oThis.msLastFrame) / 1000.0;	//ms between frames, Then / by 1 second to get the fraction of a second.

			//Now execute frame since the time has elapsed.
			oThis.fps			= Math.floor(1/sDelta); //Time it took to generate one frame, divide 1 by that to get how many frames in one second.
			oThis.msLastFrame	= msCurrent;
			Time.deltaTime 	    = sDelta;
			Time.time			+=sDelta;

            oThis.callBack(sDelta);

			if(oThis.isActive) {
                if(fps !== undefined && fps < 60 && fps > 0){
                    let waitingTime = (1/oThis.targetFps-1/oThis.fps)*1000;
                    if(waitingTime < 0) waitingTime = 0;
                    setTimeout(() => {window.requestAnimationFrame(oThis.run);}, waitingTime);
                }else{
                    window.requestAnimationFrame(oThis.run);
                }
            }
            if(oThis.displayStats){
                oThis.stats.fps.update();
                oThis.stats.memmory.update();
            }
		}
	}

    showStats(){
        this.stats.memmory.showPanel(2); // Panel 2 = memory
        this.stats.fps.showPanel(0); // Panel 0 = fps
        this.stats.fps.domElement.style.visibility = "visible";
        this.stats.memmory.domElement.style.visibility = "visible";
        this.displayStats = true;
    }

    hideStats(){
        this.stats.memmory.hidePanel(2); // Panel 2 = memory
        this.stats.fps.hidePanel(0); // Panel 0 = fps
        this.stats.fps.domElement.style.visibility = "hidden";
        this.stats.memmory.domElement.style.visibility = "hidden";
        this.displayStats = false;
    }

	start(){
		this.isActive = true;
		this.msLastFrame = performance.now();
		window.requestAnimationFrame(this.run);
		return this;
	}

	stop(){
		this.isActive = false;
		return this;
	}
}
