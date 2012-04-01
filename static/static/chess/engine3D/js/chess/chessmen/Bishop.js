/*
 * spec:
 *
 * white: true/false
 * pos : position
 */
var Bishop=function(spec) {

   var theta=(spec.white)?Math.PI/2:-Math.PI/2;
   var that=Chessman({
       json: "/static/chess/engine3D/ressources/chess/Bishop/bishop.json",
       pos: spec.pos,
       texture: CHESS.texture_bishop,
       white: spec.white,
       theta: theta
   });

   that.numType=3;

   that.checkPos=function(ij, eat) {
       if (Math.abs(that.pos[0]-ij[0])!=Math.abs(that.pos[1]-ij[1])) return false;
       var dx=Math.abs(that.pos[0]-ij[0]);
       var stepX=(that.pos[0]<ij[0])?1:-1,
           stepY=(that.pos[1]<ij[1])?1:-1;

       var middlePos;
       for (var i=1; i<dx; i++) {
           middlePos=[that.pos[0]+stepX*i, that.pos[1]+stepY*i];
           if (!CHESS.checkPos(middlePos)) return false;
       }

       if (!eat) return true;
       return CHESS.eat(that, ij, false);
   }

   return that;
};

