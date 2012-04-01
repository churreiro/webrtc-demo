/*
 * spec :
 * A, B, C, D : 3d points
 *
 */

var QuadCollider=function(spec) {
    var that={

        pick: function(ray) {
            return ray.intersectQuadDist(spec.A, spec.B, spec.C, spec.D);
        }
    } //end that
    return that;
};