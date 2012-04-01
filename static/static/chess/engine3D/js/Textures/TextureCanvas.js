/*
 * spec.canvas: canvas2d
 *
 *
 */
var TextureCanvas=function(spec) {
    var that={
    loaded: false,
    texture0:GL.createTexture(),


    init: function() {
        that.load();
    },

    //load low resolution texture
    load:function() {
        GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
        GL.bindTexture(GL.TEXTURE_2D, that.texture0);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, spec.canvas);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST_MIPMAP_LINEAR);
        GL.generateMipmap(GL.TEXTURE_2D);
        GL.bindTexture(GL.TEXTURE_2D, null);
        that.loaded=true;
    },

    draw:function() {
        GL.bindTexture(GL.TEXTURE_2D, that.texture0);
        LAST_TEXTURE=false;
    }
    }; //end that

    that.init();
    return that;

};
