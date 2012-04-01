/*
 * spec:
 *
 * white: true/false
 * pos : position
 */
var Knight=function(spec) {

   var theta=(spec.white)?0:Math.PI;

   var that=Chessman({
       json: "/static/chess/engine3D/ressources/chess/Knight/knight.json",
       texture: CHESS.texture_knight,
       pos: spec.pos,
       white: spec.white,
       theta: theta
   });

   that.numType=2;
   that.checkPos=function(ij, eat) {
       if (!(
            ((Math.abs(ij[0]-that.pos[0])==2) && (Math.abs(ij[1]-that.pos[1])==1))
           ||( (Math.abs(ij[1]-that.pos[1])==2) && (Math.abs(ij[0]-that.pos[0])==1))
            )) return false;
                
       if (!eat) return true;
       return CHESS.eat(that, ij, false);
   }

   return that;
};
