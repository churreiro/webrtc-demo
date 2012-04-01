//middleware between maisons and framework 3 - included in scriptDev and called in main index
/*spec : 
 *canvasId : id of the canvas element
 *fullScreen : boolean
 */

/**
 * @constructor
 */
var Engine3D=function(spec) {
    
    
    this.init=function() {        
        this.current_params=Engine3D.params;
        this.game=Game(spec);
        this.game.load();        //load materials
        this.loaded=true;
    }

    //called by middleware - only for 3D view mode
    this.start=function() {        
        this.current_params=Engine3D.params;
        CONTEXT3D.setParams();        
        CONTEXT3D.shaders0.set();
        CONTEXT3D.nav0.set();        
        CONTEXT3D.setFullScreen();        
        //VIEW.set();
        CONTEXT3D.displayOn();        
        return true;
    }

    this.stop=function() {
        CONTEXT3D.shaders0.unset();
        CONTEXT3D.displayOff();
        NAVIGATION.unset();
    }

};


