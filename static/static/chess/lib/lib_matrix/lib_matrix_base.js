/*
 * base operation on all dim matrix
 */

var lib_matrix_base={
       invertNew: function(m, n) { //invert matrix m of dimension n using Gauss pivot
          var inv=this.buildINew(n);
          var a=this.copyNew(m);
          var k, i,c,b,d,l;
          for (k=0; k<n;k++) {
              if (a[k*n+k]==0) {
                  for (i=k; i<n; i++) {
                      if (a[i*n+k]!=0) { //on échange la ligne i et la ligne k
                          for (c=0; c<n; c++) {
                              b=a[k*n+c]; //variable intermédiaire
                              a[k*n+c]=a[i*n+c];
                              a[i*n+c]=b;
                              //on fait de meme sur inv
                              b=inv[k*n+c];
                              inv[k*n+c]=inv[i*n+c];
                              inv[i*n+c]=b;
                          }
                          break;
                      }
                  }
              }
              //on a un coeff positif sur la diagonale
              //on le ramène a 1
              b=a[k*n+k];
              for (c=0; c<n; c++) {
                  a[k*n+c]/=b;
                  inv[k*n+c]/=b;
              }
              //on soustrait aux autres lignes
              for (l=0; l<n; l++) {
                  if (l!=k) {
                      var b=a[l*n+k];
                      for (c=0; c<n; c++) {
                          a[l*n+c]-=b*a[k*n+c];
                          inv[l*n+c]-=b*inv[k*n+c];
                      }
                  }
              }
          }
          return inv;
      },

    mix: function(a, b, t) {// return t*a + (1-t)*b
        var res = new Array(a.length) ;
        for (var i = 0; i < 16; ++i)
            res[i]=t*a[i]+(1-t)*b[i];
        return res;
    },

    copyNew: function(a) { //copy the matrix
        var r=new Array(a.length);
        for (var i=0; i<a.length; i++) {
            r[i]=a[i];
        }
        return r;
    },

    //build identity
    buildINew: function(n) {
        var r=[];
        for (var i=0; i<n; i++) {
            for (var j=0; j<n; j++) {
                if(i==j) r.push(1); else r.push(0);
            }
        }
        return r;
    }
};

