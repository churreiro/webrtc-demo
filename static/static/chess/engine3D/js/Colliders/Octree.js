/*
 *
 * spec :
 * mesh : mesh
 * jsonOctree : octree
 *
 */

var Octree=function(spec) {
    var that={
        type: "Octree",
        hasNoFaces: (spec.jsonOctree.f===0),
        hasChilds: !(spec.jsonOctree.childs===0),
        init: function() {
            if (that.hasNoFaces && that.hasChilds) {
                that.childs=[];
                that.cube=Cube({min: spec.jsonOctree.min, max: spec.jsonOctree.max});
                that.numChilds=spec.jsonOctree.childs.length;
                for (var i=0; i<that.numChilds; i++) {
                    that.childs.push(Octree({mesh: spec.mesh, jsonOctree:spec.jsonOctree.childs[i]}));
                }
            } else {
                that.faces=spec.jsonOctree.f;
            }
       },

       pick: function(ray) {        
        //console.log("test pick");
        var pickPoint=false;
        if (that.hasNoFaces)
        {
            if (!that.hasChilds) return false;
            if (that.cube.pick(ray)) {
                for (var i=0; i<that.numChilds; i++) {
                    pickPoint=that.childs[i].pick(ray);
                    if (pickPoint) return pickPoint;
                }
                return false;
            }
            else return false; //no subcube picked            
        } else {
            for (i=0; i<that.faces.length; i++) {
                //console.log("test faces");
                    pickPoint=ray.intersectTri(spec.mesh.getFace(that.faces[i]));
                    if (pickPoint) return pickPoint;
                }
            return false; //no face picked
            }            
        }

    } //end that
    that.init();
    return that;
};



