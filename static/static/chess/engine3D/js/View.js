/*
 * spec :
 * cam : cam position
 * theta : theta
 * phi : phi
 */
var VIEW;
var View=function(spec) {
    spec.movement=false;
    var that={cam: spec.cam,
         theta: spec.theta,
         phi: spec.phi,
         mvMatrix: lib_matrix_base4.getI4(),
         mvMatrixInv: lib_matrix_base4.getI4(),
         cam:spec.cam,
         type: "view",


    //movement : object {callback: function()-called at the end,
    //                     move: function(cam)- called every fr, change cam and return true or false}
    
    addMovement: function(movement) {
        spec.movement=movement;
    },

    save: function() {
        return {theta: that.theta, phi: that.phi, cam: lib_array.copy(that.cam)};
    },

    drawPhysics: function() {
       if (spec.movement) {
           if (!spec.movement.move(VIEW.cam)) {
               spec.movement.callback();
               spec.movement=false;
           } else {
               VIEW.move();
           }
       }
    },

    draw:function() {
        GL.uniform3fv(SHADER_PROGRAM.cam_pos, that.cam);
        Matrix.loadMvMatrix(that.mvMatrix);
    },

    move:function() {      
        lib_matrix_base4.copy(Matrix.I4, that.mvMatrix);
        lib_matrix_rot.rotateYFast(that.mvMatrix, Math.PI);
        lib_matrix_rot.rotateZFast(that.mvMatrix, that.theta);
        lib_matrix_rot.rotateXFast(that.mvMatrix, that.phi);
        lib_matrix_mv.translateRot(that.mvMatrix, that.cam);
        lib_matrix_mv.invert(that.mvMatrixInv, that.mvMatrix);
        if (SHADER_PROGRAM.has_lightCam){
            GL.uniform3fv(SHADER_PROGRAM.lightCam, [Math.sin(that.phi)*-Math.sin(that.theta),
                                                    Math.sin(that.phi)*Math.cos(that.theta),
                                                    -Math.cos(that.phi)]);
        }
    },

    rotate_soft: function(angle, duration) {
       var i=0,
           angle0=that.theta,
           cam0=lib_vector3D.vnew(that.cam),
           dAngle=angle*CONTEXT3D.fr/duration,
           di=CONTEXT3D.fr/duration,
           imax=1/di;
           spec.movement= {
           move: function(cam) {

              if (i>1) {
                  that.setPos([cam0[0]*Math.cos(angle)-cam0[1]*Math.sin(angle),
                  cam0[1]*Math.cos(angle)+cam0[0]*Math.sin(angle),
                  cam0[2]]);
                  that.setTheta(angle0+angle);
                  return false;
              }
              var j=Math.sin(i*Math.PI/2);
              that.setPos([cam0[0]*Math.cos(j*imax*dAngle)-cam0[1]*Math.sin(j*imax*dAngle),
                           cam0[1]*Math.cos(j*imax*dAngle)+cam0[0]*Math.sin(j*imax*dAngle),
                           cam0[2]]);
              that.setTheta(angle0+j*imax*dAngle);
              i+=di;
              return true;
           },
           callback: function() {return true;}
       }
    },

    setTheta:function(theta) {
        that.theta=theta;
        that.move();
    },
    
    setPhi:function(phi) {
        that.phi=phi;
        that.move();
    },

    setPos:function(cam)  {
        that.cam0=lib_vector3D.vnew(cam);
        that.setCam(cam);
        that.move();
    },

    setPosThetaPhi: function(cam, theta, phi) {
        that.cam=cam;
        that.theta=theta;
        that.phi=phi;
        that.move();
    },

    translate:function(v) {
        var newCam=lib_vector3D.addNew(that.cam, v);        
        that.setCam(newCam);        
        that.move();
        SCENE.sortObjMiddle();
    },

    moveFront: function() {
        that.translate([Math.sin(that.theta)*-Engine3D.params.step, Math.cos(that.theta)*Engine3D.params.step, 0.0]);
    },

    moveBack: function() {
        that.translate([Math.sin(that.theta)*Engine3D.params.step, Math.cos(that.theta)*-Engine3D.params.step, 0.0]);
    },

    turnRight: function() {
        that.theta-=Engine3D.params.stepTheta;
    },

    turnLeft: function() {
        that.theta+=Engine3D.params.stepTheta;
    },

    turnTheta:function(dTheta) {
        that.theta+=dTheta;
        that.setSpheric();
        that.move();
    },

    turnPhi:function(dPhi) {
        that.phi+=dPhi;
        that.setSpheric();
        that.move();
    },

    setSpheric: function() {
       //compute cam position with that.R and theta and phi
       that.cam=[that.R*Math.sin(that.theta)*Math.sin(that.phi),
                  -that.R*Math.cos(that.theta)*Math.sin(that.phi),
                   Math.min(that.Z,that.R*Math.cos(that.phi))];

    },

    computeR: function() {
      that.R=lib_vector3D.norm(that.cam);
      that.Z=that.cam[2];
      that.setSpheric();
    },

    setCam: function(cam) {
       that.cam=cam;
       return true;
    },

    //put vector v into the VIEW direction
    dirRefScene: function(v) {
       var v0=v[0], v1=v[1];
       v[0]=that.mvMatrix[0]*v0+that.mvMatrix[1]*v1+that.mvMatrix[2]*v[2];
       v[1]=that.mvMatrix[4]*v0+that.mvMatrix[5]*v1+that.mvMatrix[6]*v[2];
       v[2]=that.mvMatrix[8]*v0+that.mvMatrix[9]*v1+that.mvMatrix[10]*v[2];
    },

    //put the origin in the object ref
    orRefScene: function(v) {
       v[0]=that.mvMatrixInv[12];
       v[1]=that.mvMatrixInv[13];
       v[2]=that.mvMatrixInv[14];
    },

    distanceToCam: function(P) {
        return lib_vector3D.distance(that.cam, P);
    }


    }//end that
    VIEW=that;

    return that;
};


