var lib_dom={
    removeElement: function(id) {
        var element=document.getElementById(id);
        element.parentNode.removeChild(element);
    },

    show: function(id) {
        document.getElementById(id).style.display='block';
    },

    hide: function(id) {
        document.getElementById(id).style.display='none';
    },

    hideShow: function(id) {
        var elt=document.getElementById(id);
        if (elt.style.display=='block') {
            this.hideElement(elt);
        } else {
            this.showElement(elt);
        }
    },

    get: function(id) {
        return document.getElementById(id);
    },

    getValue: function(id){
        return document.getElementById(id).value;
    },

    showElement: function(elt) {
        elt.style.display='block';
    },

    hideElement: function(elt) {
        elt.style.display='none';
    },

    translate: function(id, x, y) {
        var elt=this.get(id);
        var pos=this.getPos(elt);
        this.setPos(id, pos[0]+x, pos[1]+y);      
    },

    get_top: function(id) {
        return parseInt(this.get(id).style.top);
    },

    get_left: function(id) {
        return parseInt(this.get(id).style.left);
    },

    //return the absolute position in px of an element
    getPos: function(oElement) {
        var res=[0,0];
              //retourne la coordonnée Y d'un élément
	      while( oElement != null ) {
		      res[1] += oElement.offsetTop;
                      res[0] += oElement.offsetLeft
		      oElement = oElement.offsetParent;
	      }
	      return res;
      },

      setPos: function(id, x, y) {
            var elt=this.get(id);
            this.setPosElt(elt, x, y);
      },

      setMarginsElt: function(elt, x, y) {
          elt.style.marginLeft=Math.round(x)+'px';
          elt.style.marginTop=Math.round(y)+'px';
      },

      getMarginsElt: function(elt) {
          return (parseFloat(elt.style.marginLeft, elt.style.marginTop));
      },

      setPosElt: function(elt, x, y) {
          elt.style.left=Math.round(x)+'px';
          elt.style.top=Math.round(y)+'px';
      },

      setClass: function(elt, classe) {
          elt.setAttribute("class", classe);
      },

      set_front: function(id) {
          ZINDEXFRONT++;
          var elt=this.get(id);
          elt.style.zIndex=ZINDEXFRONT;
      },

      transformMatrix: function(elt, theta, center) {
          var cos=Math.cos(theta),
              sin=Math.sin(theta);
          var matrix="matrix("+cos+","+(-sin)+","+(sin)+","+cos+","+center[0]+","+center[1]+")";
          elt.style.transform=matrix;
          elt.style.MozTransform=matrix;
          
      },

      rotate: function(elt, angle) {
          var angleDeg=lib_maths.round(lib_maths.radToDeg(angle), 2);
          elt.style.MozTransform="rotate("+angleDeg+"deg)";
          elt.style.WebkitTransform="rotate("+angleDeg+"deg)";
          elt.style.transform="rotate("+angleDeg+"deg)";
         // console.log("lib_dom.rotate "+angleDeg);
          //elt.style.MozTransform="rotate("+angleDeg+"deg)";
      }
};
var ZINDEXFRONT=100;
