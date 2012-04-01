var SCENE, I;
/*
 *specs :
 *json : json of the scene
 *
 */

var Scene=function(spec) {
    var that={meshes:[],          
          obj_chessman:[],
          obj_shadow:[],
          obj_square: [],
          obj_pickable: [],
          shadowMode: false,

    //====================================================================== LOAD AND DRAW THE SCENE ==========================================================


    load:function() {
       GL.clearDepth(1.0);
       GL.enable(GL.DEPTH_TEST);
       GL.depthFunc(GL.LEQUAL);
       
       //GL.enable(GL.CULL_FACE);
       //GL.cullFace(GL.BACK);
       //GL.frontFace(GL.CCW);
              

       //GL.stencilOp(GL.KEEP, GL.DECR, GL.INCR);
       //GL.enable(GL.DITHER);
       
       Matrix.pUniform();
       GL.clearColor(0, 0, 0, 1.0);

       //GL.stencilFunc(GL.EQUAL,0, 255);
       //GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
 
       GL.uniform1i(SHADER_PROGRAM.uSampler, 0);
       GL.uniform1f(SHADER_PROGRAM.screenRed, 0);
   },

    //physic engine
    drawPhysics: function() {        
        VIEW.drawPhysics();
        CONTEXT3D.nav.drawPhysics();
        for (var i=0; i<that.obj_chessman.length; i++) {
            if (that.obj_chessman[i].drawPhysics) that.obj_chessman[i].drawPhysics();
        }
        if(TOWERLEFT.obj) TOWERLEFT.obj.drawPhysics();
        if(TOWERRIGHT.obj) TOWERRIGHT.obj.drawPhysics();
        VIDEOSCREEN.drawPhysics();
    },

    draw:function() {        
        GL.viewport(0.0, 0.0, CONTEXT3D.width, CONTEXT3D.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        //GL.clearStencil(255);        
               GL.uniform1i(SHADER_PROGRAM.uSampler, 0);
       GL.uniform1f(SHADER_PROGRAM.screenRed, 0);
        VIEW.draw();
        
        that.drawAlone();
        if (CONTEXT3D.get_active()) window.requestAnimationFrame(that.draw);
    },

    pick: function() {
        var lmin=9999, l, i, pickedObj=false;
        for (i=0; i<that.obj_pickable.length; i++) {
            if (! that.obj_pickable[i].pickable) continue;
            l=that.obj_pickable[i].pick(RAY);
            if (!l) continue;
            //l=VIEW.distanceToCam(l);
            if (l>lmin) continue;
            lmin=l;
            pickedObj=that.obj_pickable[i];
        }
        if (pickedObj) pickedObj.doPick();
    },


    drawAlone:function() {

        Matrix.vUniform();

        for (I=0; I<that.obj_chessman.length; I++) {
            Matrix.mvPushMatrix();            
            that.obj_chessman[I].draw();
            Matrix.mvPopMatrix();
        }

        //GL.enable(GL.BLEND);        
        for (I=0; I<that.obj_square.length; I++) {
            Matrix.mvPushMatrix();
            that.obj_square[I].draw();
            Matrix.mvPopMatrix();
        }

        Matrix.mvPushMatrix();
        TOWERRIGHT.draw();
        Matrix.mvPopMatrix();

        Matrix.mvPushMatrix();
        TOWERLEFT.draw();
        Matrix.mvPopMatrix();


        Matrix.mvPushMatrix();
        TABLE.draw();
        Matrix.mvPopMatrix();
        
        GL.enable(GL.BLEND);

        Matrix.mvPushMatrix();            
            VIDEOSCREEN.draw();            
        Matrix.mvPopMatrix();
        
        //GL.enable(GL.STENCIL_TEST);

        that.shadowMode=true;
        GL.uniform1i(SHADER_PROGRAM.shadow, 1);
        //GL.stencilMask(255);
        //GL.clearStencil(0);

        for (I=0; I<that.obj_shadow.length; I++) {
            Matrix.mvPushMatrix();
            that.obj_shadow[I].draw();
            Matrix.mvPopMatrix();
        }
        
        //GL.stencilMask(0);
        GL.uniform1i(SHADER_PROGRAM.shadow, 0);
        //GL.disable(GL.STENCIL_TEST);
        GL.disable(GL.BLEND);
        that.shadowMode=false;

        Matrix.mvPushMatrix();
        if (GROUND.draw) GROUND.draw();
        Matrix.mvPopMatrix();

        GL.flush();
    },

    //========================================================== OBJECTS MANIPULATION ==================================================================

    
    addObjChessman:function(obj) {
        that.obj_chessman.push(obj);
        that.obj_chessman.sort(function(a,b) {
            var ca=(a.white)?8:0,
                cb=(b.white)?8:0;
            return ((a.numType+ca)-(b.numType+cb));
        
        });
    },
    addObjShadow:function(obj) {that.obj_shadow.push(obj);},
    addPickable:function(obj) {that.obj_pickable.push(obj);},
    addObjSquare: function(obj) {that.obj_square.push(obj);}

    }//end that
    SCENE=that;
    that.load();
    return that;
};


