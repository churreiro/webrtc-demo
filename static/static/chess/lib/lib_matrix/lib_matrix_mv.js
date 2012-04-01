/*
 * Operation specific to mvMatrix
 *
 */
var lib_matrix_mv={
    distance:function(mv1, mv2) { //return the distance between 2 mv matrix displacements
        return Math.sqrt((mv1[12]-mv2[12])*(mv1[12]-mv2[12])+(mv1[13]-mv2[13])*(mv1[13]-mv2[13])+(mv1[14]-mv2[14])*(mv1[14]-mv2[14]));
    },

    applyRot:function(phi, axe, deplMatrix) { //apply a rotation
        var d=lib_matrix_getDepl(deplMatrix);
        var rot=lib_matrix_4_to_3(deplMatrix);
        rot=lib_matrix_multMatrix3(rot, lib_matrix_rotMatrix(phi, axe));
        return lib_matrix_buildMvMatrix(rot, d);
    },

    //apply rotation from movement matrix m to vector v
    applyMRotNew: function(m, v) {
       return [m[0]*v[0]+m[1]*v[1]+m[2]*v[2],
               m[4]*v[0]+m[5]*v[1]+m[6]*v[2],
               m[8]*v[0]+m[9]*v[1]+m[10]*v[2]];
    },

    transNew:function(trans, a) { //apply a transition
        return new Array(a[0],a[1],a[2],a[3], a[4],a[5],a[6],a[7], a[8],a[9],a[10],a[11], a[12]+trans[0],a[13]+trans[1],a[14]+trans[2],a[15]);
    },

    buildNew:function (r, d)  {
        return new Array(r[0],r[1],r[2],d[0], r[3],r[4],r[5],d[1], r[6],r[7],r[8],d[2], d[0],d[1],d[2],1);
    },

    getDepl: function(a) {
        return [a[12], a[13],a[14]];
    },

    translate: function(m,v) {
        m[12]+=v[0];
        m[13]+=v[1];
        m[14]+=v[2];
    },

    setPos: function(m,v) {
       m[12]=v[0];
       m[13]=v[1];
       m[14]=v[2];
    },

    translateRot: function(m,v) {
       m[12]+=v[0]*m[0]+v[1]*m[4]+v[2]*m[8];
       m[13]+=v[0]*m[1]+v[1]*m[5]+v[2]*m[9];
       m[14]+=v[0]*m[2]+v[1]*m[6]+v[2]*m[10];
    },

    combine: function(a,m) {
         var mv0=a[0], mv1=a[1],mv2=a[2], mv4=a[4], mv5=a[5],mv6=a[6], mv8=a[8], mv9=a[9];
         a[12]+=a[0]*m[12]+a[4]*m[13]+a[8]*m[14];
         a[13]+=a[1]*m[12]+a[5]*m[13]+a[9]*m[14];
         a[14]+=a[2]*m[12]+a[6]*m[13]+a[10]*m[14];

         a[0]=mv0*m[0]+mv4*m[1]+mv8*m[2];
         a[1]=mv1*m[0]+mv5*m[1]+mv9*m[2];
         a[2]=mv2*m[0]+mv6*m[1]+a[10]*m[2];

         a[4]=mv0*m[4]+mv4*m[5]+mv8*m[6];
         a[5]=mv1*m[4]+mv5*m[5]+mv9*m[6];
         a[6]=mv2*m[4]+mv6*m[5]+a[10]*m[6];

         a[8]=mv0*m[8]+mv4*m[9]+mv8*m[10];
         a[9]=mv1*m[8]+mv5*m[9]+mv9*m[10];
         a[10]=mv2*m[8]+mv6*m[9]+a[10]*m[10];
    },

    combineNew: function(n,m) {
        return [n[0]*m[0]+n[4]*m[1]+n[8]*m[2],n[1]*m[0]+n[5]*m[1]+n[9]*m[2], n[2]*m[0]+n[6]*m[1]+n[10]*m[2],  n[3]*m[0]+n[7]*m[1]+n[11]*m[2],
                n[0]*m[4]+n[4]*m[5]+n[8]*m[6], n[1]*m[4]+n[5]*m[5]+n[9]*m[6],n[2]*m[4]+n[6]*m[5]+n[10]*m[6],  n[3]*m[4]+n[7]*m[5]+n[11]*m[6],
                n[0]*m[8]+n[4]*m[9]+n[8]*m[10],n[1]*m[8]+n[5]*m[9]+n[9]*m[10],n[2]*m[8]+n[6]*m[9]+n[10]*m[10],   n[3]*m[8]+n[7]*m[9]+n[11]*m[10],
                n[12]+n[0]*m[12]+n[4]*m[13]+n[8]*m[14], n[13]+n[1]*m[12]+n[5]*m[13]+n[9]*m[14], n[14]+n[2]*m[12]+n[6]*m[13]+n[10]*m[14],1];
    },

    //combine m to n, fully when t=0, not when t=1
    combineT: function(n,m, t) {
         var mv0=n[0], mv1=n[1], mv4=n[4], mv5=n[5], mv8=n[8], mv9=n[9], t1=1-t;

         n[12]+=t1*(n[0]*m[12]+n[4]*m[13]+n[8]*m[14]);
         n[13]+=t1*(n[1]*m[12]+n[5]*m[13]+n[9]*m[14]);
         n[14]+=t1*(n[2]*m[12]+n[6]*m[13]+n[10]*m[14]);

         n[0]=mv0*(m[0]*t1+t)+mv1*m[4]*t1+n[2]*m[8]*t1;
         n[1]=mv0*m[1]*t1+mv1*(m[5]*t1+t)+n[2]*m[9]*t1;
         n[2]=mv0*m[2]*t1+mv1*m[6]*t1+n[2]*(m[10]*t1+t);

         n[4]=mv4*(m[0]*t1+t)+mv5*m[4]*t1+n[6]*m[8]*t1;
         n[5]=mv4*m[1]*t1+mv5*(m[5]*t1+t)+n[6]*m[9]*t1;
         n[6]=mv4*m[2]*t1+mv5*m[6]*t1+n[6]*(m[10]*t1+t);

         n[8]=mv8*(m[0]*t1+t)+mv9*m[4]*t1+n[10]*m[8]*t1;
         n[9]=mv8*m[1]*t1+mv9*(m[5]*t1+t)+n[10]*m[9]*t1;
         n[10]=mv8*m[2]*t1+mv9*m[6]*t1+n[10]*(m[10]*t1+t);
    },

    //combine mv with m and m2. if t=0, combine only mv and m
    combineT2: function(mv,m,m2,t) {
         var mv0=mv[0], mv1=mv[1], mv4=mv[4], mv5=mv[5], mv8=mv[8], mv9=mv[9], t1=1-t;

         mv[12]+=t1*(mv[0]*m[12]+mv[4]*m[13]+mv[8]*m[14])+t*(mv[0]*m2[12]+mv[4]*m2[13]+mv[8]*m2[14]);
         mv[13]+=t1*(mv[1]*m[12]+mv[5]*m[13]+mv[9]*m[14])+t*(mv[1]*m2[12]+mv[5]*m2[13]+mv[9]*m2[14]);
         mv[14]+=t1*(mv[2]*m[12]+mv[6]*m[13]+mv[10]*m[14])+t*(mv[2]*m2[12]+mv[6]*m2[13]+mv[10]*m2[14]);

         mv[0]=mv0*(m[0]*t1+t*m2[0])+mv1*(m[4]*t1+t*m2[4])+mv[2]*(m[8]*t1+t*m2[8]);
         mv[1]=mv0*(m[1]*t1+t*m2[1])+mv1*(m[5]*t1+t*m2[5])+mv[2]*(m[9]*t1+t*m2[9]);
         mv[2]=mv0*(m[2]*t1+t*m2[2])+mv1*(m[6]*t1+t*m2[6])+mv[2]*(m[10]*t1+t*m2[10]);

         mv[4]=mv4*(m[0]*t1+t*m2[0])+mv5*(m[4]*t1+t*m2[4])+mv[6]*(m[8]*t1+t*m2[8]);
         mv[5]=mv4*(m[1]*t1+t*m2[1])+mv5*(m[5]*t1+t*m2[5])+mv[6]*(m[9]*t1+t*m2[9]);
         mv[6]=mv4*(m[2]*t1+t*m2[2])+mv5*(m[6]*t1+t*m2[6])+mv[6]*(m[10]*t1+t*m2[10]);

         mv[8]=mv8*(m[0]*t1+t*m2[0])+mv9*(m[4]*t1+t*m2[4])+mv[10]*(m[8]*t1+t*m2[8]);
         mv[9]=mv8*(m[1]*t1+t*m2[1])+mv9*(m[5]*t1+t*m2[5])+mv[10]*(m[9]*t1+t*m2[9]);
         mv[10]=mv8*(m[2]*t1+t*m2[2])+mv9*(m[6]*t1+t*m2[6])+mv[10]*(m[10]*t1+t*m2[10]);
    },


    combineT22: function(mv,m,m2,t) {
         var mv0=mv[0], mv1=mv[1], mv4=mv[4], mv5=mv[5], mv8=mv[8], mv9=mv[9], t1=1-t;

         mv[12]+=t1*(mv[0]*m[12]+mv[4]*m[13]+mv[8]*m[14])+t*(mv[0]*m2[12]+mv[4]*m2[13]+mv[8]*m2[14]);
         mv[13]+=t1*(mv[1]*m[12]+mv[5]*m[13]+mv[9]*m[14])+t*(mv[1]*m2[12]+mv[5]*m2[13]+mv[9]*m2[14]);
         mv[14]+=t1*(mv[2]*m[12]+mv[6]*m[13]+mv[10]*m[14])+t*(mv[2]*m2[12]+mv[6]*m2[13]+mv[10]*m2[14]);

         mv[0]=mv0*(m[0]*t1+t*m2[0])+mv1*(m[4]*t1+t*m2[4])+mv[2]*(m[8]*t1+t*m2[8]);
         mv[1]=mv0*(m[1]*t1+t*m2[1])+mv1*(m[5]*t1+t*m2[5])+mv[2]*(m[9]*t1+t*m2[9]);
         mv[2]=mv0*(m[2]*t1+t*m2[2])+mv1*(m[6]*t1+t*m2[6])+mv[2]*(m[10]*t1+t*m2[10]);

         mv[4]=mv4*(m[0]*t1+t*m2[0])+mv5*(m[4]*t1+t*m2[4])+mv[6]*(m[8]*t1+t*m2[8]);
         mv[5]=mv4*(m[1]*t1+t*m2[1])+mv5*(m[5]*t1+t*m2[5])+mv[6]*(m[9]*t1+t*m2[9]);
         mv[6]=mv4*(m[2]*t1+t*m2[2])+mv5*(m[6]*t1+t*m2[6])+mv[6]*(m[10]*t1+t*m2[10]);

         mv[8]=mv8*(m[0]*t1+t*m2[0])+mv9*(m[4]*t1+t*m2[4])+mv[10]*(m[8]*t1+t*m2[8]);
         mv[9]=mv8*(m[1]*t1+t*m2[1])+mv9*(m[5]*t1+t*m2[5])+mv[10]*(m[9]*t1+t*m2[9]);
         mv[10]=mv8*(m[2]*t1+t*m2[2])+mv9*(m[6]*t1+t*m2[6])+mv[10]*(m[10]*t1+t*m2[10]);
    },

    invert:function(m, mv) {
         m[0]=mv[0];
         m[1]=mv[4];
         m[2]=mv[8];
         m[4]=mv[1];
         m[5]=mv[5];
         m[6]=mv[9];
         m[8]=mv[2];
         m[9]=mv[6];
         m[10]=mv[10];
         m[12]=-(mv[0]*mv[12]+mv[1]*mv[13]+mv[2]*mv[14]);
         m[13]=-(mv[4]*mv[12]+mv[5]*mv[13]+mv[6]*mv[14]);
         m[14]=-(mv[8]*mv[12]+mv[9]*mv[13]+mv[10]*mv[14]);
    },

    invertNew: function(mv) {
        var r=[0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
        this.invert(r, mv);
        return r;
    },

    moveOrigin: function(m, vSrc, vDest) { //apply m matrix to vector v
        vDest[0]=m[0]*vSrc[0]+m[1]*vSrc[1]+m[2]*vSrc[2]-m[12]*m[0]-m[13]*m[1]-m[14]*m[2];
        vDest[1]=m[4]*vSrc[0]+m[5]*vSrc[1]+m[6]*vSrc[2]-m[12]*m[4]-m[13]*m[5]-m[14]*m[6];
        vDest[2]=m[8]*vSrc[0]+m[9]*vSrc[1]+m[10]*vSrc[2]-m[12]*m[8]-m[13]*m[9]-m[14]*m[10];
    },

    moveDirection: function(m, vSrc,vDest) {
        vDest[0]=m[0]*vSrc[0]+m[1]*vSrc[1]+m[2]*vSrc[2];
        vDest[1]=m[4]*vSrc[0]+m[5]*vSrc[1]+m[6]*vSrc[2];
        vDest[2]=m[8]*vSrc[0]+m[9]*vSrc[1]+m[10]*vSrc[2];
    },

    getInvertDepl: function(mv, c) {
        c[0]=-(mv[0]*mv[12]+mv[1]*mv[13]+mv[2]*mv[14]);
        c[1]=-(mv[4]*mv[12]+mv[5]*mv[13]+mv[6]*mv[14]);
        c[2]=-(mv[8]*mv[12]+mv[9]*mv[13]+mv[10]*mv[14]);
    },

    multVectorTransNew: function(m,v) {
        return [m[0]*v[0]+m[4]*v[1]+m[8]*v[2]+m[12], m[1]*v[0]+m[5]*v[1]+m[9]*v[2]+m[13], m[2]*v[0]+m[6]*v[1]+m[10]*v[2]+m[14]];
    },

    multVectorNew: function(m,v) {
        return [m[0]*v[0]+m[1]*v[1]+m[2]*v[2]+m[3], m[4]*v[0]+m[5]*v[1]+m[6]*v[2]+m[7], m[8]*v[0]+m[9]*v[1]+m[10]*v[2]+m[11]];
    },

    invX: function(m) {
        m[0]*=-1;m[4]*=-1;m[8]*=-1;m[12]*=-1;
    },

    buildFrom2DWall: function(theta, phi, v) {
        var cos=Math.cos(theta), sin=Math.sin(theta);
        var res=lib_matrix_base4.copyNew(Matrix.I4);
                lib_matrix_rot.rotateXFast(res, phi);
        lib_matrix_rot.rotateZFast(res, theta);

        //lib_matrix_rot.rotateYFast(res, phi);
        this.setPos(res, v);
        this.invX(res);
        return res;

    },

    buildFrom2DFloor: function() {
        //var cos=Math.cos(theta), sin=Math.sin(theta);
        return [ -1, 0, 0, 0,
                 0, 0, 1, 0,
                 0, 1, 0, 0,
                 0, 0, 0, 1
                ];
    },

    //mv : VIEW mvmatrix
    picking_dirRefScene: function(mv, v) {
       var v0=v[0], v1=v[1];
       v[0]=mv[0]*v0+mv[1]*v1+mv[2]*v[2];
       v[1]=mv[4]*v0+mv[5]*v1+mv[6]*v[2];
       v[2]=mv[8]*v0+mv[9]*v1+mv[10]*v[2];
   },

   invertX: function(m) {
       m[0]*=-1;
       m[4]*=-1;
       m[8]*=-1;
   },

   invertY: function(m) {
       m[1]*=-1;
       m[5]*=-1;
       m[9]*=-1;
   }
};

