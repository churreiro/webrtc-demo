/*
 * spec:
 *
 * white: true/false
 * pos : position
 */
var Queen=function(spec) {

   var that=Chessman({
       json: "/static/chess/engine3D/ressources/chess/Queen/queen.json",
       texture: CHESS.texture_queen,
       pos: spec.pos,
       white: spec.white
   });

   that.numType=4;
   that.checkPos=function(ij, eat) {
       if (
            ((ij[0]!=that.pos[0]) && ij[1]!=that.pos[1])
            &&
            (Math.abs(that.pos[0]-ij[0])!=Math.abs(that.pos[1]-ij[1]))
          ) return false;

       if (((ij[0]==that.pos[0]) || ij[1]==that.pos[1])) { //used like a rook
           var c=(ij[0]==that.pos[0])?1:0;
           var way=(that.pos[c]<ij[c])?1:-1;
           var middle;
           for (var i=1; i<Math.abs(that.pos[c]-ij[c]); i++) {
               middle=(c==0)?[that.pos[c]+i*way, that.pos[1]]: [that.pos[0], that.pos[c]+i*way];
               if (!CHESS.checkPos(middle)) return false;
           }
       } else { //used like a bishop
           var dx=Math.abs(that.pos[0]-ij[0]);
           var stepX=(that.pos[0]<ij[0])?1:-1,
               stepY=(that.pos[1]<ij[1])?1:-1;

           var middlePos;
           for (var i=1; i<dx; i++) {
               middlePos=[that.pos[0]+stepX*i, that.pos[1]+stepY*i];
               if (!CHESS.checkPos(middlePos)) return false;
           }
       }

       if (!eat) return true;
       return CHESS.eat(that, ij, false);

   }

   return that;
};
