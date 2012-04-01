/*
 * spec:
 *
 * white: true/false
 * pos : position
 */
var Pawn=function(spec) {

   
   var that=Chessman({
       json: "/static/chess/engine3D/ressources/chess/Pawn/pawn.json",
       texture: CHESS.texture_pawn,
       pos: spec.pos,
       white: spec.white
   });

   that.numType=0;
   that.checkPos=function(ij, eat) {
       var step=(spec.white)?1:-1;
       
       if ((ij[1]==that.pos[1]) && (ij[0]==that.pos[0]+step)) {
           if (!CHESS.checkPos(ij)) return false; //normal displacement
           return !CHESS.checkChess(spec.white, that, ij);
       } else if ((ij[1]==that.pos[1]) && (ij[0]==that.pos[0]+2*step) && that.firstTime) {
           if (!CHESS.checkPos(ij)) return false; //first time played - 2 square displacement
           return !CHESS.checkChess(spec.white, that, ij);
       } else if (
                ((ij[1]==that.pos[1]+1) || (ij[1]==that.pos[1]-1)) 
                && (ij[0]==that.pos[0]+step)
                ){
           //eat :)
           if (!eat) return true;
           return CHESS.eat(that, ij, true); //f
           
       } else {
           return false;
       }



   }

   return that;
};
