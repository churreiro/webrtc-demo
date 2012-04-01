var Chessboard=function() {
    var that={
        board: [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0]
        ],
        init: function() {
            var white=CHESS.textureWhite,
                black=CHESS.textureBlack;
            var w=CHESS.squareSize[0],
                h=CHESS.squareSize[1],
                is_white=false,
                blacks=[],
                whites=[],
                mesh=Quad({w:w, h:h});
            for (var i=0; i<8; i++) {
                for (var j=0; j<8; j++) {
                    var mvMatrix=lib_matrix_base4.getI4(),
                        pos=[CHESS.offset[0]+i*w+w/2,CHESS.offset[1]+j*h+h/2,CHESS.offset[2]];

                    lib_matrix_mv.setPos(mvMatrix, pos);
                    is_white=((i+j)%2==0);
                    var square=Obj({mesh: mesh,
                                         texture: (is_white)?white: black,
                                         mvMatrix: mvMatrix,
                                         render: Renders.board});

                    square.octree=QuadCollider({
                        A: [-w/2, -h/2, 0],
                        B: [w/2, -h/2, 0],
                        C: [w/2, h/2, 0],
                        D: [-w/2, h/2, 0]
                    });
                    square.pickable=true;                   
                    square.ij=[i, j];

                    square.setdoPick(function() {                        
                        if (!CHESS.current_chessman) {
                            var chessman=CHESS.game[this.ij[0]][this.ij[1]];
                            if (chessman) return chessman.doPick();
                            return false;
                        } else {
                            //check if current chessman is allowed on this position

                            var is_possible=CHESS.current_chessman.checkPos(this.ij, true);
                            if (!is_possible) return false;
                            //movement is possible. Move the piece                            
                            
                            CHESS.current_chessman.move(this.ij, is_possible, true);
                        }
                    });

                    that.board[i][j]=square;
                    if (is_white) whites.push(that.board[i][j]); else blacks.push(that.board[i][j]);
                    
                }
            }

            SCENE.obj_square=whites.concat(blacks);
            SCENE.obj_pickable=SCENE.obj_pickable.concat(whites).concat(blacks);
            

        }
    }
    that.init();
    return that;
    
};


