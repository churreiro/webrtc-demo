/*
 * spec :
 *
 * min : vector 3D - corner of the cube
 * max : vector 3D - opposite corner of the cube
 *
 */

var Cube=function(spec) {
    var that={
        type: "cube",
        //corners of the cube :
        cornerA: [spec.min[0], spec.min[1], spec.min[2]],
        cornerB:[spec.max[0], spec.min[1], spec.min[2]],
        cornerC:[spec.max[0], spec.max[1], spec.min[2]],
        cornerD:[spec.min[0], spec.max[1], spec.min[2]],
        cornerE:[spec.min[0], spec.min[1], spec.max[2]],
        cornerF:[spec.max[0], spec.min[1], spec.max[2]],
        cornerG:[spec.max[0], spec.max[1], spec.max[2]],
        cornerH:[spec.min[0], spec.max[1], spec.max[2]],
        center:[0.5*(spec.min[0]+spec.max[0]), 0.5*(spec.min[1]+spec.max[1]), 0.5*(spec.min[2]+spec.max[2])],
        
        pick:function(ray) {
            //console.log("cube picked") ;
            if (ray.intersectQuad(that.cornerA, that.cornerB, that.cornerC, that.cornerD)) return that.center;
            if (ray.intersectQuad(that.cornerA, that.cornerB, that.cornerF, that.cornerE)) return that.center;
            if (ray.intersectQuad(that.cornerB, that.cornerC, that.cornerG, that.cornerF)) return that.center;
            if (ray.intersectQuad(that.cornerC, that.cornerD, that.cornerH, that.cornerG)) return that.center;
            if (ray.intersectQuad(that.cornerA, that.cornerD, that.cornerH, that.cornerE)) return that.center;
            return false;
        }
    }//end that
    return that;
};