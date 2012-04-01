var NAVIGATION;
var Navigation=function()  {
    var spec={
        oldX: 0,
        oldY: 0,
        CLIC: false,
        keysDown: []
    };
    var that={

    mouseMove:function(e) {
        if (spec.CLIC) {
            VIEW.turnTheta(Engine3D.params.mouse_sensitivityX*(spec.oldX-e.clientX));
            VIEW.turnPhi(Engine3D.params.mouse_sensitivityY*(-spec.oldY+e.clientY));
            spec.oldX=e.clientX;
            spec.oldY=e.clientY;
        }
    },

    addKeyDown: function(keyCode) {
        if (spec.keysDown.indexOf(keyCode)==-1) spec.keysDown.push(keyCode);
    },

    keyDown: function(e) {
            return false;
            //console.log(e.keyCode);
            //e.preventDefault();
            /*switch(e.keyCode) {
                case 81: //q
                case 65: //a
                case 37: //left arrow
                    NAVIGATION.addKeyDown(37);
                break;
                case 68: //d
                case 39: //right arrow
                    NAVIGATION.addKeyDown(39);
                break;
                case 90: //z
                case 38: //up arrow
                    NAVIGATION.addKeyDown(38);
                    e.preventDefault();
                break;
                case 40: //down arrow
                case 83: //s
                    NAVIGATION.addKeyDown(40);
                    e.preventDefault();
                break;
                case 33: //pg up
                    NAVIGATION.addKeyDown(33);
                     e.preventDefault();
                break;
                case 34: //pg down
                    NAVIGATION.addKeyDown(34);
                     e.preventDefault();
                break;
            }*/
    },

    drawPhysics: function() {
        for (var i=0; i<spec.keysDown.length; i++) {
                    switch(spec.keysDown[i]) {
                    case 37: //left arrow
                        VIEW.turnLeft();
                    break;
                    case 39: //left arrow
                        VIEW.turnRight();
                    break;
                    case 38: //up arrow
                        VIEW.moveFront();
                    break;
                    case 40: //down arrow
                        VIEW.moveBack();
                    break;
                    case 33: //pg up
                        VIEW.translate([0,0,-0.02]);
                    break;
                    case 34: //pg down
                        VIEW.translate([0,0,0.02]);
                    break;
                }
        }
        VIEW.move();
    },

    clearKeys:function() {
        spec.keysDown=[];
    },

    keyUp:function(e) {
        e.preventDefault();
        switch(e.keyCode) {
            case 37: //left arrow
            case 81: //q
            case 65: //a
                NAVIGATION.delKeyDown(37);
            break;
            case 68: //d
            case 39: //right arrow
                NAVIGATION.delKeyDown(39);
            break;
            case 90: //z
            case 38: //up arrow
                NAVIGATION.delKeyDown(38);
            break;
            case 83: //s
            case 40: //down arrow
                NAVIGATION.delKeyDown(40);
            break;
            case 33: //pg up
                NAVIGATION.delKeyDown(33);
            break;
            case 34: //pg down
                NAVIGATION.delKeyDown(34);
            break;
        }
    },

    delKeyDown:function(keyCode) {
        lib_array.removeElement(spec.keysDown, keyCode);
    },

    mouseOut:function(e) {
        spec.CLIC=false;
    },

    mouseRoll:function(e) {
        e.preventDefault();
        return false;
        /*var roll;
        if (e.detail) {
            roll=e.detail; //Firefox
	} else {
            roll=-0.025*e.wheelDelta; //chrome
	}
        VIEW.turnPhi(roll*0.01); */
    },

    mouseUp: function(e) {
        switch(e.button) {
            case 0:
                if (Math.abs(e.clientX-spec.oldX)+Math.abs(e.clientY-spec.oldY)<10) {
                    //this is a click
                    that.click(e);
                }
                spec.CLIC=false;
                break;
        }
    },

    click: function(e) {
        //if (!GAME.started) return false;
        RAY.set([e.clientX, e.clientY]);
        SCENE.pick();
        return true;
    },

    mouseDown: function(e) {
        //e.preventDefault();
        switch(e.button) {
            case 0: //rotation
                spec.CLIC=true;
                spec.oldX=e.clientX;
                spec.oldY=e.clientY;
                //SCENE.pick(e.clientX, e.clientY);
            break;
        }
    },

    set:function(){
       CONTEXT3D.set_nav(that);
       CONTEXT3D.cv.onmousemove=NAVIGATION.mouseMove;
       CONTEXT3D.cv.onmousedown=NAVIGATION.mouseDown;
       CONTEXT3D.cv.onmouseup=NAVIGATION.mouseUp;
       CONTEXT3D.cv.onmouseout=NAVIGATION.mouseOut;
       //document.onkeydown=NAVIGATION.keyDown;
       //document.onkeyup=NAVIGATION.keyUp;
       window.onresize=CONTEXT3D.sizeCanvas;
    },

    unset: function() {       
       CONTEXT3D.cv.onmousemove=function() {return false;}
       CONTEXT3D.cv.onmousedown=function() {return true;}
       CONTEXT3D.cv.onmouseup=function() {return false;}
       CONTEXT3D.cv.onmouseout=function() {return false;}
        window.removeEventListener('DOMMouseScroll', NAVIGATION.mouseRoll, false);
        window.onresize=function() {return false;}
    }
    }//end that
    return that;
};