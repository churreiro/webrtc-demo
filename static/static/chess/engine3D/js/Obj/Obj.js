/*
 * spec :
 * mesh : mesh of the object
 * render : render of the object
 * 
 *
 * facultative :
 * mvMatrix: mvMatrix - facultative (default : I4);
 * origin: origin
 * texture : texture of the object
 *
 */
var Obj=function(spec) {
    spec.mvMatrix=spec.mvMatrix || lib_matrix_base4.getI4();
    spec.origin=spec.origin || lib_matrix_mv.getDepl(spec.mvMatrix);    
    spec.render=spec.render || 0;
    spec.texture=spec.texture || false;
    spec.moving=false;

    var that={
     pickable: false,
     origin: spec.origin,
     mvMatrix: spec.mvMatrix,     


    draw:function() {
        GL.uniformMatrix4fv(SHADER_PROGRAM.OBJ_Matrix, false, that.mvMatrix);
        lib_matrix_mv.combine(Matrix.stack[0], that.mvMatrix);
        GL.uniformMatrix4fv(SHADER_PROGRAM.mvMatrixUniform, false, that.mvMatrix);
        Renders.set(spec.render);
        Matrix.mvUniform();
        if (spec.texture && !SCENE.shadowMode) spec.texture.draw();
        spec.mesh.draw();
        return true;
    },

    load: function() {
        spec.mvMatrixInv=lib_matrix_mv.invertNew(that.mvMatrix);
        spec.mesh.load();
    },

    computeInvMatrix: function() {
        lib_matrix_mv.invert(spec.mvMatrixInv, that.mvMatrix);
    },

    setTexture: function(texture) {
        spec.texture=texture;
    },

    //=================================================================== MOVEMENT ================================================================================
    //translate the object
    translate:function(v) {
        lib_matrix_mv.translate(that.mvMatrix, v);        
    },

    //set object position
    setPos:function(v) {
        lib_matrix_mv.setPos(that.mvMatrix, v);
    },

    //get object position
    getPos: function() {
         return lib_matrix_mv.getDepl(that.mvMatrix);
    },

    //parabollic vertical move with top hight h to position p with total time t (in ms)
    //call func is called when the hzt distance is > L-call_l
    move_parabollic: function(p, h, t, call_l, call_func) {
        var move_i=0,
            move_iMax=t/CONTEXT3D.fr,
            oldPos=that.getPos(),
            called=false;
        var dx=CONTEXT3D.fr*(p[0]-oldPos[0])/t,
            dy=CONTEXT3D.fr*(p[1]-oldPos[1])/t,
            dz=p[2]-oldPos[2],
            L=Math.sqrt((p[0]-oldPos[0])*(p[0]-oldPos[0])+(p[1]-oldPos[1])*(p[1]-oldPos[1])),
            a=lib_vector3D.distance(oldPos, p)*0.5;
        var dl=Math.sqrt(dx*dx+dy*dy),
            k=h/(a*a);
        spec.drawPhysics=function() {
            var l=move_i*dl;
            if (l>L-call_l && !called) {call_func(); called=true; }
            var pos=[oldPos[0]+dx*move_i,
                     oldPos[1]+dy*move_i,
                     oldPos[2]+(h-k*(l-a)*(l-a))+dz*l/L];
            move_i++;
            if (move_i>=move_iMax) {
                pos=p;
                spec.moving=false;
            }
            that.setPos(pos);
        }
        spec.moving=true;
    },

    rotate_soft: function(angle0, angle, duration) {
       var i=0,
           pos0=lib_vector3D.vnew(that.getPos()),
           dAngle=angle*CONTEXT3D.fr/duration,
           di=CONTEXT3D.fr/duration,
           imax=1/di;
           spec.moving=true;
           spec.drawPhysics=function() {
              if (i>1) {
                  that.setTheta(angle0+angle);
                  that.setPos([pos0[0]*Math.cos(angle)-pos0[1]*Math.sin(angle),
                  pos0[1]*Math.cos(angle)+pos0[0]*Math.sin(angle),
                  pos0[2]]);                  
                  spec.moving=false;
                  return false;
              }
              var j=Math.sin(i*Math.PI/2);
              that.setTheta(angle0+j*imax*dAngle);
              that.setPos([pos0[0]*Math.cos(j*imax*dAngle)-pos0[1]*Math.sin(j*imax*dAngle),
                           pos0[1]*Math.cos(j*imax*dAngle)+pos0[0]*Math.sin(j*imax*dAngle),
                           pos0[2]]);              
              i+=di;
              return true;
          }
    },


    drawPhysics: function() {       
       if (spec.moving) {
           spec.drawPhysics();
       }
    },

    pick: function(ray) {
        if (!that.octree) return false;
        ray.changeRef(that.mvMatrix);
        return that.octree.pick(ray);
    },

    doPick: function() {
        return false;
    },

    setdoPick: function(f) {
        that.doPick=f;
    },
    
    resetPos: function() {
        lib_matrix_base4.setI4(that.mvMatrix);
    },

    setTheta: function(theta) {
        lib_matrix_base4.setI4(that.mvMatrix);
        lib_matrix_rot.rotateZFast(that.mvMatrix, theta);
    },

    //rotate
    rotateX:function(theta) {
        lib_matrix_rot.rotateXFast(that.mvMatrix, theta);
    },

    rotateY:function(theta) {
        lib_matrix_rot.rotateYFast(that.mvMatrix, theta);
    },

    rotateZ:function(theta) {
        lib_matrix_rot.rotateZFast(that.mvMatrix, theta);
    },

    setTexture: function(texture) {
        spec.texture=texture;
    }
    }//end that

    return that;
};

