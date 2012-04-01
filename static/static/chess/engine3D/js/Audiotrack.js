/*
 * spec :
 * soundURL: url of the track
 *
 */
var Audiotrack=function(spec) {
   spec.elt=document.createElement("audio");
   spec.elt.autoplay=false;
   spec.elt.preload=true;
   spec.elt.controls=false;
   spec.elt.onended=function(){spec.elt.currentTime=0; spec.elt.pause();};
   spec.elt.src=spec.soundURL;

   var that={
       play: function() {
           spec.elt.play();
       }

   };
   return that;
};