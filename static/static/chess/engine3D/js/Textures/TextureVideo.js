/*
 * spec.video: videoElt
 *
 *
 */
var TextureVideo=function(spec) {
    var that={
    loaded: false,
    texture0:GL.createTexture(),

    //load low resolution texture
    init:function() {
        //alert(spec.video);
        
        GL.bindTexture(GL.TEXTURE_2D, that.texture0);
       GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA,GL.RGBA, GL.UNSIGNED_BYTE, spec.video );
       	GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE );
	    GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE );
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);    
        GL.bindTexture(GL.TEXTURE_2D, null);
        that.loaded=true;
    },

    refresh: function() {
      GL.bindTexture(GL.TEXTURE_2D, that.texture0);
      GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA,GL.RGBA, GL.UNSIGNED_BYTE, spec.video );
      GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE );
      GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE );
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
      //GL.bindTexture(GL.TEXTURE_2D, null);
    },

    draw:function() {        
        that.refresh();
        LAST_TEXTURE=false;
    }
    }; //end that

    that.init();
    return that;

};
