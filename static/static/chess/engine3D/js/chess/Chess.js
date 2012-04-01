var CHESS, TABLE, TOWERLEFT, TOWERRIGHT;
var Chess=function(spec) {
   var that={
     offset: [-2,-2,0], //offset of the chess board
     size: [4,4], //size of the chessBoard
     rackDist: 0.25, //distance from the rack to the border of the chess board
     current_chessman: false,
     white_chessmen:[],
     black_chessmen:[],

     get_position: function(pos) {
         return [that.offset[0]+pos[0]*that.squareSize[0]+that.halfSquareSize[0],
         that.offset[1]+pos[1]*that.squareSize[1]+that.halfSquareSize[1],
         that.offset[2]
        ];
     },

     //return true if chessmate, false else
     checkChessMate: function(white) {
        var chessmen=(white)?that.white_chessmen:that.black_chessmen, ci, i, j;
        for (ci=0; ci<chessmen.length; ci++) {
            if (!chessmen[ci].alive) continue;
            for (i=0; i<8; i++) {
                for (j=0; j<8; j++) {
                    if (i==chessmen[ci].pos[0] && j==chessmen[ci].pos[1]) continue;
                    if (!chessmen[ci].checkPos([i,j], false)) continue; //position is not possible
                    if (!that.checkChess(white, chessmen[ci], [i,j])) { return false; }//position is not in chess
                }
            }
        }
        return true;
     },
     
     //check if the white king (if white==true, the black else) is in chess
     //replace the position of chessman with pos
     //return true if chess
     checkChess: function(white, chessman, pos) {
        var hostile_chessmen=(white)?that.black_chessmen:that.white_chessmen,
            hostile_chessman, ci, savePos, old_chessman;

        var myking=(white)?that.white_king:that.black_king;
        
        savePos=[chessman.pos[0], chessman.pos[1]];
        chessman.pos=pos;
        old_chessman=that.game[pos[0]][pos[1]];
        that.game[pos[0]][pos[1]]=chessman;
        that.game[savePos[0]][savePos[1]]=false;

        var restorePos=function() {
            that.game[pos[0]][pos[1]]=old_chessman;
            that.game[savePos[0]][savePos[1]]=chessman;
            chessman.pos=savePos;
        }

        for (ci=0; ci<hostile_chessmen.length; ci++) {
            hostile_chessman=hostile_chessmen[ci];
            if(!hostile_chessman.alive) continue;
            if (old_chessman==hostile_chessman) continue; //old_chessman hab been eaten :)
            //test if can eat the holy king :)
            if (hostile_chessman.checkPos(myking.pos, false)) {               
                restorePos();
                return true;
            }
        }

        //hostile_chessman=null;
        //chessman.pos=null;
        restorePos();
        //hostile_chessmen=null;
        return false;
     },

     //check position for intermediary displacements
     checkPos: function(pos) {
        if (pos[0]<0 || pos[0]>7 || pos[1]<0 || pos[1]>7) return false; //out of the board
        var oldChessman=that.game[pos[0]][pos[1]];
        if (!oldChessman) return true;        
        return false;
     },

     eat: function(chessman, pos, eatOnly) {
        if (pos[0]<0 || pos[0]>7 || pos[1]<0 || pos[1]>7) return false; //out of the board
        var oldChessman=that.game[pos[0]][pos[1]];
        //check if my king is in chess after that
        if (that.playerWhite===chessman.get_white()) { //player move its chessman
            if (that.checkChess(that.playerWhite, chessman, pos)) {
                //console.log("cannot move ! in chess");                
                return false;
            };
        }
        if (!oldChessman) return !eatOnly;
        if (oldChessman.get_white()===chessman.get_white()) return false;
        //eat        
        return oldChessman;
     },

     getChessman: function(ij) {
        if (that.game[ij[0]][ij[1]]===false) return true;
        return that.game[ij[0]][ij[1]];
     },

     doRestart: function() { //called by GAME.doRestart
        var i,j;
        that.playerWhite=true;
        that.current_chessman=false
        for (i=0; i<8; i++) {
            for (j=0; j<8; j++) {
                that.game[i][j]=false;
            }
        }
        for (i=0; i<SCENE.obj_chessman.length; i++) {
            if (SCENE.obj_chessman[i].reset) SCENE.obj_chessman[i].reset();
        }


     },

     start: function() {
        that.playerWhite=true;
        that.rackWhite=0; //eaten pieces offset
        that.rackBlack=0; //eaten pieces offset
     },

     init: function() {
        that.squareSize=[that.size[0]/8, that.size[1]/8];
        that.halfSquareSize=[that.squareSize[0]/2, that.squareSize[1]/2];

        that.texture_pawn=Texture({imageURL: "/static/chess/engine3D/ressources/chess/Pawn/bake.png"});
        that.texture_rook=Texture({imageURL: "/static/chess/engine3D/ressources/chess/Rook/bake.png"});
        that.texture_knight=Texture({imageURL: "/static/chess/engine3D/ressources/chess/Knight/bake.png"});
        that.texture_bishop=Texture({imageURL: "/static/chess/engine3D/ressources/chess/Bishop/bake.png"});
        that.texture_king=Texture({imageURL: "/static/chess/engine3D/ressources/chess/King/bake.png"});
        that.texture_queen=Texture({imageURL: "/static/chess/engine3D/ressources/chess/Queen/bake.png"});

        that.start();        
        that.white_king=King({white: true, pos: [0,3]});
        that.black_king=King({white: false, pos: [7,3]});
        that.game=[
             [Rook({white: true, pos: [0,0]}),
             Knight({white: true, pos: [0,1]}),
             Bishop({white: true, pos: [0,2]}),
             that.white_king,
             Queen({white: true, pos: [0,4]}),
             Bishop({white: true, pos: [0,5]}),
             Knight({white: true, pos: [0,6]}),
             Rook({white: true, pos: [0,7]})],

             [Pawn({white: true, pos: [1,0]}),
             Pawn({white: true, pos: [1,1]}),
             Pawn({white: true, pos: [1,2]}),
             Pawn({white: true, pos: [1,3]}),
             Pawn({white: true, pos: [1,4]}),
             Pawn({white: true, pos: [1,5]}),
             Pawn({white: true, pos: [1,6]}),
             Pawn({white: true, pos: [1,7]})],

             [false, false, false, false, false, false, false, false],
             [false, false, false, false, false, false, false, false],
             [false, false, false, false, false, false, false, false],
             [false, false, false, false, false, false, false, false],

             [Pawn({white: false, pos: [6,0]}),
             Pawn({white: false, pos: [6,1]}),
             Pawn({white: false, pos: [6,2]}),
             Pawn({white: false, pos: [6,3]}),
             Pawn({white: false, pos: [6,4]}),
             Pawn({white: false, pos: [6,5]}),
             Pawn({white: false, pos: [6,6]}),
             Pawn({white: false, pos: [6,7]})],

             [Rook({white: false, pos: [7,0]}),
             Knight({white: false, pos: [7,1]}),
             Bishop({white: false, pos: [7,2]}),
             that.black_king,
             Queen({white: false, pos: [7,4]}),
             Bishop({white: false, pos: [7,5]}),
             Knight({white: false, pos: [7,6]}),
             Rook({white: false, pos: [7,7]})]
         ]; 

         that.textureWhite=Texture({imageURL: "/static/chess/engine3D/ressources/chess/white.jpg"});
         that.textureBlack=Texture({imageURL: "/static/chess/engine3D/ressources/chess/black.jpg"});

         that.towerLeft=Tower({side: 1});
         that.towerRight=Tower({side : -1});

         that.board=Chessboard();
         var mvMatrix=lib_matrix_base4.getI4();
         lib_matrix_mv.setPos(mvMatrix, [0,0,-0.2]);
         TABLE=JSONobj({textureURL: "/static/chess/engine3D/ressources/Board/wood.jpg",
                             jsonURL: "/static/chess/engine3D/ressources/Board/board.json",
                             mvMatrix: mvMatrix,
                             render: Renders.misc});

         TOWERLEFT=that.towerLeft;
         TOWERRIGHT=that.towerRight;

         that.soundput=Audiotrack({soundURL: "/static/chess/sounds/put.mp3"});
     },

     changePlayer: function() {
         that.playerWhite=!that.playerWhite;
         that.current_chessman=false;
     }
   } //end that
   CHESS=that;
   that.init();
   
   //return that;
};

