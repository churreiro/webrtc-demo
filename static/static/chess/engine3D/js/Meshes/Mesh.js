/*
 *specs :
 *vertexBufferArray : js array of vertexBuffers
 *options : number of options in VBA. default: 0
 *vertexIndexBufferArray : js array of vertexIndexBuffers
 *drawMode [GL.STATIC_DRAW]
 */
var LAST_MESH=false;
var Mesh=function(spec) {
    if (spec.options!==false) spec.options=spec.options || 0;
    spec.drawMode=spec.drawMode || GL.STATIC_DRAW;

    var that={
        loaded: false,        

    load:function() {
        spec.vertexBuffer=VertexBuffer({vertex: spec.vertexBufferArray, drawMode: spec.drawMode, options: spec.options});
        spec.vertexIndexBuffer=VertexIndexBuffer({indices: spec.vertexIndexBufferArray});
        that.loaded=true;
    },

    draw:function() {
        if (that!=LAST_MESH) {
            spec.vertexBuffer.draw();
            LAST_MESH=that;
        }
        spec.vertexIndexBuffer.draw();
    },

    //return  a 2 dimensionnal array of 3x3 with the 3 points of the face
    getFace: function(face_index) {
        var r=[], i, vertex_index;
        for (i=0; i<3; i++) {
            vertex_index=spec.vertexIndexBufferArray[3*face_index+i];
            r.push([spec.vertexBufferArray[vertex_index*10], spec.vertexBufferArray[vertex_index*10+1], spec.vertexBufferArray[vertex_index*10+2]]);
        }
        
        return r;
    }
    }; //end that
    that.load();
    return that;
};


