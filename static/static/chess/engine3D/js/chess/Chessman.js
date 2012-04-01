/*
 * spec :
 * json: URL of the json
 * white: true/false
 * pos: position on the board
 * texture: texture
 *
 * facultative :
 * theta : Z rotation
 */

var Chessman=function(spec) {
    spec.theta=spec.theta || 0;

    var mvMatrix=lib_matrix_base4.getI4();
    lib_matrix_rot.rotateZFast(mvMatrix, spec.theta);
    spec.v=CHESS.get_position(spec.pos);
    lib_matrix_mv.setPos(mvMatrix, spec.v);

    var that=JSONobj({texture: spec.texture,
                     jsonURL: spec.json,
                     mvMatrix: mvMatrix,
                     render: Renders.chessman,
                     white: (spec.white)?1:0});
    that.get_white=function(){return spec.white;};
    that.white=spec.white;

    that.set=function() {
        that.alive=true;
        that.firstTime=true;
        that.pos=[spec.pos[0], spec.pos[1]];
    }

    that.reset=function() {
        spec.v=CHESS.get_position(spec.pos);
        CHESS.game[spec.pos[0]][spec.pos[1]]=that;
        if (spec.pos[0]!=that.pos[0] || spec.pos[1] !=that.pos[1]) that.obj.move_parabollic(CHESS.get_position(spec.pos), 1, 500, 99, function() {});
        that.set();
    }
    that.set();
    
    that.doPick=function() {
       /* if (GAME.chessmate) return false;
        if (CHESS.current_chessman) {
           if (that==CHESS.current_chessman) {
               that.putDown(true);
               CHESS.current_chessman=false;
               return true;
           }
           if (spec.white===CHESS.playerWhite) {
            CHESS.current_chessman.putDown(true);
           } else {
             CHESS.board.board[that.pos[0]][that.pos[1]].doPick();
             return true;
           }
        }
        if (CHESS.playerWhite===spec.white && GAME.playerWhite==spec.white) {
            that.putUp(true);
            CHESS.current_chessman=that;
            return true;
        }*/
        //if (GAME.chessmate) return false;
        if (CHESS.current_chessman) {
           if (that==CHESS.current_chessman) {
               that.putDown(true);
               CHESS.current_chessman=false;
               return true;
           }
           //if (spec.white===CHESS.playerWhite) {
           // CHESS.current_chessman.putDown(true);
           //} else {
           
             CHESS.board.board[that.pos[0]][that.pos[1]].doPick();
             return true;
           //}
        }
            that.putUp(true);
            CHESS.current_chessman=that;
            return true;
        
        
        
    }
    
    that.putDown=function(sendToPeer) {
        spec.v[2]=CHESS.offset[2];
        lib_matrix_mv.setPos(mvMatrix, spec.v);
        if (sendToPeer) GAME.sendMsg("CHESS:DOWN:"+that.pos[0]+","+that.pos[1]);
    }

    that.putUp=function(sendToPeer) {
        spec.v[2]=CHESS.offset[2]+0.2;
        lib_matrix_mv.setPos(mvMatrix, spec.v);
        if (sendToPeer) GAME.sendMsg("CHESS:UP:"+that.pos[0]+","+that.pos[1]);
    }

    that.move=function(ij, is_possible, sendToPeer) {
        var eatFunc=(is_possible===true)? function() {return true;}:is_possible.eaten;
        that.obj.move_parabollic(CHESS.get_position(ij), 0.5, 500, 0.2, eatFunc);
        setTimeout(CHESS.soundput.play, 900);
        CHESS.game[that.pos[0]][that.pos[1]]=false;
        CHESS.game[ij[0]][ij[1]]=that;


        if (sendToPeer) GAME.sendMsg("CHESS:MOVE:"+that.pos[0]+","+that.pos[1]+","+ij[0]+","+ij[1]);

        that.pos=[ij[0], ij[1]];

        //check if this makes the otherplayer in chess
        var hostile_king=(spec.white)?CHESS.black_king:CHESS.white_king;
        var canEatKing=that.checkPos(hostile_king.pos, false);

        if (canEatKing) {
           if (CHESS.checkChessMate(!spec.white)) {
               GAME.over();
               return false;
           }
           //console.log("chess");
           if (CHESS.playerWhite==GAME.playerWhite) { //I put in chess my foe :)
               VIDEOSCREEN.setColor(true);
           } else { //I was put in chess :(
              GAME.chessAlert(true);
           }
        } else {
            //check that nobody is in chess
            VIDEOSCREEN.setColor(false);
            GAME.chessAlert(false);
        };

        spec.v=CHESS.get_position(that.pos);
        CHESS.changePlayer();
        that.firstTime=false;
    }

    that.eaten=function() {
        var y=(spec.white)?-CHESS.size[0]/2-CHESS.rackDist: CHESS.rackDist+CHESS.size[0]/2,
            x=(spec.white)?-CHESS.size[0]/2+CHESS.size[0]/16+CHESS.rackWhite*CHESS.size[0]/16: CHESS.size[0]/2-CHESS.size[0]/16-CHESS.rackBlack*CHESS.size[0]/16;
        if (spec.white) CHESS.rackWhite++; else CHESS.rackBlack++;
        var ejectPos=[x, y, CHESS.offset[2]];
        that.obj.move_parabollic(ejectPos, 2, 500);
        that.alive=false;
    }

    if (spec.white) CHESS.white_chessmen.push(that);
    else CHESS.black_chessmen.push(that);
    SCENE.addObjChessman(that);
    SCENE.addPickable(that);
    SCENE.addObjShadow(that);
    return that;
};

