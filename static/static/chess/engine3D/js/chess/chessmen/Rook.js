/*
 * spec:
 *
 * white: true/false
 * pos : position
 */
var Rook=function(spec) {

   var that=Chessman({
       json: "/static/chess/engine3D/ressources/chess/Rook/rook.json",
       texture: CHESS.texture_rook,
       pos: spec.pos,
       white: spec.white
   });

   that.numType=1;
   that.checkPos=function(ij, eat) {
       if ((ij[0]!=that.pos[0]) && ij[1]!=that.pos[1]) return false;       
       var c=(ij[0]==that.pos[0])?1:0;
       var way=(that.pos[c]<ij[c])?1:-1;
       var middle;
       for (var i=1; i<Math.abs(that.pos[c]-ij[c]); i++) {
           middle=(c==0)?[that.pos[c]+i*way, that.pos[1]]: [that.pos[0], that.pos[c]+i*way];
           if (!CHESS.checkPos(middle)) return false;
       }
       if (!eat) return true;
       return CHESS.eat(that, ij, false);
   }

   return that;
};

