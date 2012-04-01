/*
 * spec:
 *
 * imageURL: url of texture image
 *
 * facultative :
 * onload: function to lauch when loaded
 *
 */
var LAST_TEXTURE=false;
var Texture=function(spec) {
    var that={
          loaded: false,          
          texture0:GL.createTexture(),
          image:new Image(),
          init: function() {
             that.image.src=GAME.rootDir+spec.imageURL;
             that.image.onload=function() { that.loadLR(); if (spec.onload) spec.onload(that.image); }
          },

        //load low resolution texture
        loadLR:function() {
             GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);             
            GL.bindTexture(GL.TEXTURE_2D, that.texture0);
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, that.image);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
            GL.generateMipmap(GL.TEXTURE_2D);
            GL.bindTexture(GL.TEXTURE_2D, null);
            that.loaded=true;
        },

        draw:function() {            
            if (LAST_TEXTURE==that) return false;
            GL.bindTexture(GL.TEXTURE_2D, that.texture0);
            LAST_TEXTURE=that;
            return true;
        }
    };//end that
    that.init();
    return that;

};

