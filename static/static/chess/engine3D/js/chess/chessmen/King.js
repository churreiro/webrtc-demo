/*
 * spec:
 *
 * white: true/false
 * pos : position
 */
var King=function(spec) {

   var that=Chessman({
       json: "/static/chess/engine3D/ressources/chess/King/king.json",
       texture: CHESS.texture_king,
       pos: spec.pos,
       white: spec.white
   });

   that.numType=5;
   that.checkPos=function(ij, eat) {
       if (Math.abs(ij[0]-that.pos[0])>1) return false;
       if (Math.abs(ij[1]-that.pos[1])>1) return false;
       if (!eat) return true;
       return CHESS.eat(that, ij, false);
   }

   return that;
};


