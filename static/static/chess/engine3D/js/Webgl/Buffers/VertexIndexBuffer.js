/*
 * spec: indices : a javascript array 
 */

var VertexIndexBuffer = function (spec)
{    
    if ((spec.indices) === 'undefined')
        throw ("ERROR : constructor called without enough arguments in VertexIndexBuffer!");

    var that = {

    loaded : false,
    
    load : function ()
    {
        spec.buffer = GL.createBuffer ();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, spec.buffer);        
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(spec.indices), GL.STATIC_DRAW);
        spec.buffer.numItems = spec.indices.length;
        that.loaded = true;
    },
    
    draw : function () {
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, spec.buffer);
        GL.drawElements(GL.TRIANGLES, spec.buffer.numItems, GL.UNSIGNED_SHORT, 0);
    }
    }//end that

    that.load();
    return that;
};
