var lib_matrix_rot={
    rotateXFast: function(m, phi) {
          var c=Math.cos(phi);
          var s=Math.sin(phi);
          var mv1=m[1], mv5=m[5], mv9=m[9];
          m[1]=m[1]*c-m[2]*s;
          m[5]=m[5]*c-m[6]*s;
          m[9]=m[9]*c-m[10]*s;

          m[2]=m[2]*c+mv1*s;
          m[6]=m[6]*c+mv5*s;
          m[10]=m[10]*c+mv9*s;
    },

    rotateYFast: function(m, phi) {
          var c=Math.cos(phi);
          var s=Math.sin(phi);
          var mv0=m[0], mv4=m[4], mv8=m[8];
          m[0]=c*m[0]+s*m[2];
          m[4]=c*m[4]+s*m[6];
          m[8]=c*m[8]+s*m[10];

          m[2]=c*m[2]-s*mv0;
          m[6]=c*m[6]-s*mv4;
          m[10]=c*m[10]-s*mv8;
    },

    rotateZFast: function(m, phi) {
          var c=Math.cos(phi);
          var s=Math.sin(phi);
          var mv0=m[0], mv4=m[4], mv8=m[8];
          m[0]=c*m[0]-s*m[1];
          m[4]=c*m[4]-s*m[5];
          m[8]=c*m[8]-s*m[9];

          m[1]=c*m[1]+s*mv0;
          m[5]=c*m[5]+s*mv4;
          m[9]=c*m[9]+s*mv8;
    },

    rotNew:function(phi, axe) {
        var cos=Math.cos(phi), sin=Math.sin(phi), un_cos=1-cos;
        return new Array(cos+un_cos*axe[0]*axe[0], un_cos*axe[0]*axe[1]-sin*axe[2], un_cos*axe[0]*axe[2]+sin*axe[1],
                            un_cos*axe[0]*axe[1]+axe[2]*sin, cos+un_cos*axe[1]*axe[1], un_cos*axe[1]*axe[2]-sin*axe[0],
                            un_cos*axe[0]*axe[2]-sin*axe[1], un_cos*axe[1]*axe[2]+sin*axe[0], cos+un_cos*axe[2]*axe[2]);
    },
/*
 * mult m by
 * c 0-s 0
 * 0 1 0 0
 * s 0 c 0
 * 0 0 0 1
 */
    rotTransY: function(m, phi) {
          var c=Math.cos(phi);
          var s=Math.sin(phi);
          var mv0=m[0], mv4=m[4], mv8=m[8], mv12=m[12];
          m[12]=mv12*c+s*m[14];
          m[14]=-s*mv12+c*m[14];

          m[0]=c*m[0]+s*m[2];
          m[4]=c*m[4]+s*m[6];
          m[8]=c*m[8]+s*m[10];

          m[2]=c*m[2]-s*mv0;
          m[6]=c*m[6]-s*mv4;
          m[10]=c*m[10]-s*mv8;
    },
    
/*
 * mult m by
 * 1 0 0 0
 * 0 c-s 0
 * 0 s c 0
 * 0 0 0 1
 */
    rotTransX: function(m, phi) {
          var c=Math.cos(phi);
          var s=Math.sin(phi);
          var mv1=m[1], mv5=m[5], mv9=m[9], mv13=m[13];
          m[13]=mv13*c+s*m[14];
          m[14]=-s*mv13+c*m[14];

          m[1]=c*m[1]+s*m[2];
          m[5]=c*m[5]+s*m[6];
          m[9]=c*m[9]+s*m[10];

          m[2]=c*m[2]-s*mv1;
          m[6]=c*m[6]-s*mv5;
          m[10]=c*m[10]-s*mv9;
    }

};


