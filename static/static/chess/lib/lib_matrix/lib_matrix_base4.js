/*
 * base operations on dim 4 matrix *
 */
var lib_matrix_base4={
     multNew:function(a,b) { //multiply 2 matrix
        return new Array(a[0]*b[0]+a[1]*b[4]+a[2]*b[8]+a[3]*b[12], a[0]*b[1]+a[1]*b[5]+a[2]*b[9]+a[3]*b[13], a[0]*b[2]+a[1]*b[6]+a[2]*b[10]+a[3]*b[14], a[0]*b[3]+a[1]*b[7]+a[2]*b[11]+a[3]*b[15],
                      a[4]*b[0]+a[5]*b[4]+a[6]*b[8]+a[7]*b[12], a[4]*b[1]+a[5]*b[5]+a[6]*b[9]+a[7]*b[13], a[4]*b[2]+a[5]*b[6]+a[6]*b[10]+a[7]*b[14], a[4]*b[3]+a[5]*b[7]+a[6]*b[11]+a[7]*b[15],
                      a[8]*b[0]+a[9]*b[4]+a[10]*b[8]+a[11]*b[12], a[8]*b[1]+a[9]*b[5]+a[10]*b[9]+a[11]*b[13], a[8]*b[2]+a[9]*b[6]+a[10]*b[10]+a[11]*b[14], a[8]*b[3]+a[9]*b[7]+a[10]*b[11]+a[11]*b[15],
                      a[12]*b[0]+a[13]*b[4]+a[14]*b[8]+a[15]*b[12], a[12]*b[1]+a[13]*b[5]+a[14]*b[9]+a[15]*b[13], a[12]*b[2]+a[13]*b[6]+a[14]*b[10]+a[15]*b[14], a[12]*b[3]+a[13]*b[7]+a[14]*b[11]+a[15]*b[15]);
    },

    copyNew:function(a) { //copy a matrix
        return new Array(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
    },

    to3New:function(a) { //transforms a matrix 4 into a 3 matrix
        return new Array(a[0],a[1],a[2], a[4],a[5] ,a[6], a[8],a[9],a[10]);
    },

    to3TNew:function(a) { //return the transpose of mat3(a)
        return new Array(a[0], a[4], a[8], a[1], a[5], a[9], a[2], a[6], a[10]);
    },

    transposeNew:function(m) { //transpose a matrix
     return new Array(m[0],m[4],m[8],m[12],  m[1],m[5],m[9],m[13], m[2],m[6],m[10],m[14],  m[3],m[7],m[11],m[15]);
    },

    getI4: function() {
        return [1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1];
    },

    setI4: function(m) {
        m[0]=1; m[1]=0; m[2]=0; m[3]=0;
        m[4]=0; m[5]=1; m[6]=0; m[7]=0;
        m[8]=0; m[9]=0; m[10]=1; m[11]=0;
        m[12]=0; m[13]=0; m[14]=0; m[15]=1;
    },

    copy: function(s, d) {
        d[0]=s[0]; d[1]=s[1]; d[2]=s[2]; d[3]=s[3];
        d[4]=s[4]; d[5]=s[5]; d[6]=s[6]; d[7]=s[7];
        d[8]=s[8]; d[9]=s[9]; d[10]=s[10]; d[11]=s[11];
        d[12]=s[12]; d[13]=s[13]; d[14]=s[14]; d[15]=s[15];
    }
};


