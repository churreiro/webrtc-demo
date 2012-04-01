/*
 * Base operation on dim 3 matrix
 *
 */
var lib_matrix_base3={
    get_I3: function() { return [1,0,0, 0,1,0,  0,0,1]},

    multNew:function(a,b) {
        return new Array(a[0]*b[0]+a[1]*b[3]+a[2]*b[6], a[0]*b[1]+a[1]*b[4]+a[2]*b[7], a[0]*b[2]+a[1]*b[5]+a[2]*b[8],
               a[3]*b[0]+a[4]*b[3]+a[5]*b[6], a[3]*b[1]+a[4]*b[4]+a[5]*b[7], a[3]*b[2]+a[4]*b[5]+a[5]*b[8],
               a[6]*b[0]+a[7]*b[3]+a[8]*b[6], a[6]*b[1]+a[7]*b[4]+a[8]*b[7], a[6]*b[2]+a[7]*b[5]+a[8]*b[8]);
    },

    multArrayNew:function(a,b,n) { //used in articulations
         var i,r;
         r=new Array();
         for (i=0; i<n*9; i+=9) {
            r.push(a[i]*b[i]+a[i+1]*b[i+3]+a[i+2]*b[i+6], a[i]*b[i+1]+a[i+1]*b[i+4]+a[i+2]*b[i+7], a[i]*b[i+2]+a[i+1]*b[i+5]+a[i+2]*b[i+8],
                   a[i+3]*b[i]+a[i+4]*b[i+3]+a[i+5]*b[i+6], a[i+3]*b[i+1]+a[i+4]*b[i+4]+a[i+5]*b[i+7], a[i+3]*b[i+2]+a[i+4]*b[i+5]+a[i+5]*b[i+8],
                   a[i+6]*b[i]+a[i+7]*b[i+3]+a[i+8]*b[i+6], a[i+6]*b[i+1]+a[i+7]*b[i+4]+a[i+8]*b[i+7], a[i+6]*b[i+2]+a[i+7]*b[i+5]+a[i+8]*b[i+8]);
        }
        return r;
    },

    buildFromVect: function(v1,v2,v3) {
        return v1.concat(v2).concat(v3);
    },

    multVectNew: function(m, v) {
        return [m[0]*v[0]+m[1]*v[1]+m[2]*v[2],
                m[3]*v[0]+m[4]*v[1]+m[5]*v[2],
                m[6]*v[0]+m[7]*v[1]+m[8]*v[2]];

    },

    transposeNew: function(m) {
        return [m[0], m[3], m[6],
                m[1], m[4], m[7],
                m[2], m[5], m[8]]
    }
};

