/*
 * spec :
 * w : width
 * h : height
 * position : vec3 - position of video screen
 * videoURL : video URL or videoElt : video elt
 * def : definition - must be POT
 *
 *unit test :
 *var vs=VideoScreenObj({w: 2, h: 1, position: [0,0,1], def: 512, videoURL: "dev/bunny.ogv"}); SCENE.addObjMiddle(vs);
 */

var VideoScreenObj=function(spec) {
   spec.mesh=Quad({w: spec.w, h: spec.h});
   spec.mvMatrix=lib_matrix_base4.getI4();
   lib_matrix_rot.rotateXFast(spec.mvMatrix, Math.PI/2);
   lib_matrix_rot.rotateZFast(spec.mvMatrix, 3*Math.PI/2);
   lib_matrix_mv.setPos(spec.mvMatrix, spec.position);

   spec.loaded=false;
   spec.red=false;

   var that= Obj({mesh: spec.mesh,
                 mvMatrix: spec.mvMatrix,
                 render: Renders.screen,
                 texture: Texture({imageURL:"/static/chess/engine3D/ressources/waitScreen.jpg"}) });

   if (spec.videoURL) {
       spec.videoElt=document.createElement("video");
       spec.videoElt.setAttribute("autoplay", "true");
       spec.videoElt.setAttribute("width", spec.def.toString());
       spec.videoElt.setAttribute("height", spec.def.toString());
       spec.videoElt.setAttribute("onplay", "this.onplay2()");

       spec.videoElt.onplay2=function() {
        spec.loaded=true;
        that.setTexture(TextureVideo({video: spec.videoElt}));
       }
       spec.videoElt.src=spec.videoURL;

   } else {
   
       //spec.videoElt.setAttribute("onplay", "this.onplay2()");
       //spec.videoElt.setAttribute("hidden", "true");
       spec.videoElt.onplay2=function() {
        that.setTexture(TextureVideo({video: spec.videoElt}));
        spec.loaded=true;
       };
       //spec.videoElt.onplay=spec.videoElt.onplay2;
       spec.videoElt.oncanplaythrough=spec.videoElt.onplay2;
       spec.videoElt.style.visibility="hidden";
       
       DEBUG=spec.videoElt.onplay2;
   }

    that.setTheta=function(theta) {
        that.mvMatrix=lib_matrix_base4.getI4();
        lib_matrix_rot.rotateXFast(that.mvMatrix, Math.PI/2);
        lib_matrix_rot.rotateZFast(that.mvMatrix, Math.PI/2+theta);
    };

    that.setColor=function(red) { //red : bool
        if ((spec.red && red) || (!spec.red && !red)) return false;
        var t=0;
        spec.red=red;
        that.drawPhysics=function() {
            t+=0.01;
            if (t>1) {
                t=1;
                that.drawPhysics=function() { return false; };
            }
            if (red) GL.uniform1f(SHADER_PROGRAM.screenRed, t);
            else GL.uniform1f(SHADER_PROGRAM.screenRed, 1-t);
        }
        return true;
    }


   return that;
};
