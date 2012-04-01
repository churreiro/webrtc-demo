
var CONTEXT3D, GL;
/*spec :
 *view : initial view
 *canvasId : Id of the canvas
 *fullscreen : boolean
 */

var Context3D=function(spec) {
    spec.active=false;
    var that={
          cv:lib_dom.get(spec.canvasId),
          fullscreen:spec.fullscreen && true,
        
    setParams: function() {
       //console.log("set params", ENGINE3D.current_params);
       that.fr= ENGINE3D.current_params.fr;//framerate for physic engine
       that.angle = ENGINE3D.current_params.angle;//view angle in degrees
       that.zNear= spec.zNear || ENGINE3D.current_params.zNear;
       that.zFar= spec.zFar || ENGINE3D.current_params.zFar;
    },

    get_active: function() {
        return spec.active;
    },

    init: function() {
        that.setParams();
        that.initGL();
        that.sizeCanvas();

        that.shaders0=Shaders();
        that.view=spec.view;
        that.scene=Scene({});
        that.nav0=Navigation();
        //that.nav0.set();
    },

    set_nav: function(nav) {
        this.nav=nav;
        NAVIGATION=nav;
    },

    initGL:function() {
        try {
           GL = that.cv.getContext("experimental-webgl", {antialias: true});
           that.sizeCanvas();
         } catch (e) {
             //GAME.troubleshooting();
             alert("troubleshooting");
           //lib_form.alert("ERREUR : Votre ordinateur n'est pas compatible webgl");
         }
    },

    changeCanvasSize: function(w, h) {
          that.cv.width=w;
          that.cv.height=h;
    },

    sizeCanvas:function() {
      if (that.fullscreen) { //fullscreen mode
          that.width=window.innerWidth;
          that.height=window.innerHeight;
          that.changeCanvasSize(that.width, that.height)
      } else {
        that.width=that.cv.width;
        that.height=that.cv.height;
      }
      spec.cvWH=[-0.5*that.width, -0.5*that.height];
      spec.cvOffset=lib_dom.getPos(that.cv);
      GL.viewport(0.0, 0.0, that.width, that.height);
      Matrix.setPMatrix(that.angle, that.width / that.height, that.zNear, that.zFar);
      if (ENGINE3D.loaded) Matrix.pUniform();
    },

    make_cvCo: function(xy) {
        lib_vector.sub(xy, spec.cvOffset);        
        lib_vector.divideXY(xy, spec.cvWH);
        xy[0]+=1; xy[1]+=1;
    },

    setFullScreen: function() {
       that.fullscreen=true;
       that.cv.style.position="absolute";       
       that.cv.style.top="0px";
       that.cv.style.left="0px";
       that.cv.style.marginTop="0px";
       that.sizeCanvas();
    },

    unsetFullScreen: function() {
         that.fullscreen=false;
         that.cv.style.marginTop="20px";
         that.cv.width=800;
         that.cv.height=520;
         that.cv.style.position="static";
         that.sizeCanvas();
    },

    displayOff:function() {
       if (that.timer) clearInterval(that.timer);
       spec.active=false;
    },

    displayOn:function() {
        spec.active=true;
        SCENE.draw();
        that.timer=setInterval("SCENE.drawPhysics()", that.fr);
    },

    displayOnNoPhysics:function() {
        spec.active=true;
        SCENE.draw();
    }


    }//end that
    CONTEXT3D=that;
    that.init();
    return that;
};

