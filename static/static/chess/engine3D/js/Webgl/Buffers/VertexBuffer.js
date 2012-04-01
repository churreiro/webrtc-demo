/*
 * spec: vertex : a javascript array including vertexpos, vertexnorm, texCoord, option (exhaustive)
 *       options : 1,2,0 : number of given options. default : 0
 *       vertexPosition, vertexNormal, texCoord [optional] : (separated)
 *       drawMode [GL.STATIC_DRAW]
 */

var VertexBuffer = function (spec)
{
    spec.enableOptions=(spec.options!==false);
    spec.options=spec.options || 0;

    var that = {
    loaded: false,
    drawMode : spec.drawMode || GL.STATIC_DRAW,

    init: function() {
        that.vertex = spec.vertex;
        var optionsOffset=(spec.options>0)?32:0;
        //that.offsets = [0, 12, 24, optionsOffset];
        that.offsets = [0, 12, 24, 0];
        that.length = 32+spec.options*4; // number of elements used to describe a vertex        
        that.load();
    },
    
    load : function () {
        spec.buffer = GL.createBuffer ();
        GL.bindBuffer(GL.ARRAY_BUFFER, spec.buffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(spec.vertex), that.drawMode);
        spec.bufferNumItems = spec.vertex.length / that.length;
        that.loaded = true;
    },
    
    draw : function ()
    {
        GL.bindBuffer(GL.ARRAY_BUFFER, spec.buffer);
        GL.vertexAttribPointer(SHADER_PROGRAM.vertexPositionAttribute, 3, GL.FLOAT, false, that.length, that.offsets[0]);
        GL.vertexAttribPointer(SHADER_PROGRAM.vertexNormalAttribute, 3, GL.FLOAT, false, that.length, that.offsets[1]); 
        GL.vertexAttribPointer(SHADER_PROGRAM.textureCoordAttribute, 2, GL.FLOAT, false, that.length, that.offsets[2]);
       // if (spec.enableOptions && SHADER_PROGRAM.use_aOption) GL.vertexAttribPointer(SHADER_PROGRAM.optionAttribute, 2, GL.FLOAT, false, that.length, that.offsets[3]);
    }
    }//end that
    that.init();
   
    return that;
};
