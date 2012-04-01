/*
 * spec :
 * side : +1/-1 for tower right/left
 *
 */
var Tower=function(spec) {
    spec.white=false;
    var mvMatrix=lib_matrix_base4.getI4();
    lib_matrix_mv.setPos(mvMatrix, [CHESS.size[0]/2+0.6, (CHESS.size[1]/2+0.2)*spec.side,0]);
    var that=JSONobj({texture: CHESS.textureBlack,
                      jsonURL: "/static/chess/engine3D/ressources/Tower/tower.json",
                      render: Renders.misc,
                      mvMatrix: mvMatrix});


    that.swiftSide=function() {
        if (spec.white) {
            that.obj.setTexture(CHESS.textureBlack);
        } else {
            that.obj.setTexture(CHESS.textureWhite);
        }
        that.obj.rotate_soft(0, Math.PI, 2000);
        spec.white=!spec.white;
    }
    return that;
};

