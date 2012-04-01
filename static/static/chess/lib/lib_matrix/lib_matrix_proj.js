/*
 * Operations about perpective matrix, special matrix
 *
 */
var lib_matrix_proj= {
  makePerspectiveNew: function (fovy, aspect, znear, zfar) {
        var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
        var ymin = -ymax;
        var xmin = ymin * aspect;
        var xmax = ymax * aspect;
        return this.makeFrustumNew(xmin, xmax, ymin, ymax, znear, zfar);
  },

  makeFrustumNew: function(left, right,  bottom, top,  znear, zfar){
        var X = 2*znear/(right-left);
        var Y = 2*znear/(top-bottom);
        var A = (right+left)/(right-left);
        var B = (top+bottom)/(top-bottom);
        var C = -(zfar+znear)/(zfar-znear);
        var D = -2*zfar*znear/(zfar-znear);
       return new Array(X,0,0,0,  0,Y,0,0,  A,B,C,-1,   0,0,D,0 );
  }

};

