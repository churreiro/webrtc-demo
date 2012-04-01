/*
 * spec :
 * textureURL : url of the texture of the JSONObj
 * jsonURL : url of the json
 *
 * facultative:
 * mvMatrix : mv matrix
 * origin : origin
 * render : render
 * texture : Texture
 */
var JSONobj=function(spec) {

    spec.render=spec.render || 0;
    spec.mvMatrix=spec.mvMatrix || lib_matrix_base4.getI4();
    spec.origin=spec.origin || lib_matrix_mv.getDepl(spec.mvMatrix);

    var that={
        pickable: true,
        origin: spec.origin,
        loaded: false,
        type : "JSONObj",
        textureURL: spec.textureURL,
        mvMatrix: spec.mvMatrix,

        load: function(jsonStr) {
            that.jsonObj=JSON.parse(jsonStr);
        
            that.mesh=Mesh({vertexBufferArray: that.jsonObj.vertex,
                   vertexIndexBufferArray: that.jsonObj.indices,
                   options: 2});
            
            that.texture=(spec.texture)?spec.texture:Texture({imageURL: that.textureURL});
            that.octree=Octree({mesh: that.mesh, jsonOctree: that.jsonObj.octree});
            that.obj=Obj({mesh: that.mesh,
                      texture: that.texture,
                      render: spec.render,
                      mvMatrix: that.mvMatrix});
            //console.log(that.mvMatrix);
            that.draw=function() {
                if (spec.render==Renders.chessman) GL.uniform1i(SHADER_PROGRAM.white, spec.white);
                that.obj.draw();
            }

            that.drawPhysics=that.obj.drawPhysics;
            
            //SCENE.addObjMiddle(that);
            return that;
        },

        draw: function() {},
        
        //test pick with RAY
        pick: function(ray) {
            ray.changeRef(that.mvMatrix);
            return that.octree.pick(ray);
        },

        //lauched when picked
        doPick: function() {

        }
    };
     lib_ajax.get(spec.jsonURL, that.load);
     return that;
};


