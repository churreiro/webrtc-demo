var lib_vector3D={
    
    norm2: function(u) { return (u[0]*u[0]+u[1]*u[1]+u[2]*u[2]); },
    norm: function(u) { return Math.sqrt(u[0]*u[0]+u[1]*u[1]+u[2]*u[2]); },
    vnew: function(u) { return [u[0], u[1], u[2]]; },
    scale: function(u,s) { u[0]*=s;u[1]*=s;u[2]*=s; },
    subNew: function(a,b) { return [b[0]-a[0], b[1]-a[1], b[2]-a[2]]; },
    maddNew: function(a, b, t) { return new Array(a[0] + t*b[0], a[1] + t*b[1], a[2] + t*b[2]); },
    mixNew: function(u,v,t) { return [u[0]*t+v[0]*(1-t), u[1]*t+v[1]*(1-t), u[2]*t+v[2]*(1-t)]; },
    baryNew: function (u, v, a, b) { return [u[0]*a + v[0]*b, u[1]*a + v[1]*b, u[2]*a + v[2]*b]; },
    copy: function(src,dst) {dst[0]=src[0];dst[1]=src[1];dst[2]=src[2]; },
    dot: function(u,v) { return u[0]*v[0] + u[1]*v[1] + u[2]*v[2]; },
    det: function(u,v,w) { return u[0]*(v[1]*w[2]-v[2]*w[1])-u[1]*(v[0]*w[2]-v[2]*w[0])+u[2]*(v[0]*w[1]-v[1]*w[0]); },
    prodNew: function(a,u) { return [a*u[0],a*u[1],a*u[2]]; },
    add: function(u,v) { u[0]+=v[0];u[1]+=v[1];u[2]+=v[2]; },
    addNew: function(u,v) { return ([u[0]+v[0],u[1]+v[1],u[2]+v[2]]); },
    make2D: function(u) {return [u[0], u[1]];},
    middleNew: function(u,v) { return [(u[0]+v[0])*0.5, (u[1]+v[1])*0.5, (u[2]+v[2])*0.5]},

    //normalize a
    normalize: function(a) {
        var l=1./Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);
        a[0]*=l;a[1]*=l;a[2]*=l;
    },

    normalizeNew: function (a) {
        var l = 1./Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);
        return [a[0]*l, a[1]*l, a[2]*l];
    },
    //return square distance between a and b
    distance2: function(a,b) {
        return((b[0]-a[0])*(b[0]-a[0])+(b[1]-a[1])*(b[1]-a[1])+(b[2]-a[2])*(b[2]-a[2]));
    },

    //return distance between a and b
    distance: function(a,b) {
        return (Math.sqrt((b[0]-a[0])*(b[0]-a[0])+(b[1]-a[1])*(b[1]-a[1])+(b[2]-a[2])*(b[2]-a[2])));
    },

    distance2Sub: function(a,b) {
        return((b[0]+a[0])*(b[0]+a[0])+(b[1]+a[1])*(b[1]+a[1])+(b[2]+a[2])*(b[2]+a[2]));
    },

    distanceSub: function(a,b) {
        return Math.sqrt((b[0]+a[0])*(b[0]+a[0])+(b[1]+a[1])*(b[1]+a[1])+(b[2]+a[2])*(b[2]+a[2]));
    },

    //return a^b
    prodVectNew: function(a,b) {
      return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    },        

    //apply mvMatrix
    move: function(a,m) {
        var a0=a[0], a1=a[1];
        a[0]=a0*m[0]+a1*m[1]+a[2]*m[2]+m[12];
        a[1]=a0*m[4]+a1*m[5]+a[2]*m[6]+m[13];
        a[2]=a0*m[8]+a1*m[9]+a[2]*m[10]+m[14];
    },

    //get normal to (u,v)
    getNormalNew: function(u,v) {
        var a=this.prodVectNew(u,v);
        this.normalize(a);
        return a;
    },

    //get I coordinate in the base AB, AC
    getUVCoeff: function(i,abc) {
       var ab=lib_vector_sub(abc[1], abc[0]),
       ac=lib_vector_sub(abc[2], abc[0]),
       ai=lib_vector_sub(i,abc[0]);

       //coordonnées du point d'intersection dans le triangle ABC :
       var aiab=lib_vector_dot(ai, ab),
           aiac=lib_vector_dot(ai, ac),
           abac=lib_vector_dot(ab, ac),
           abab=lib_vector_dot(ab, ab),
           acac=lib_vector_dot(ac, ac),
           kac=((aiab*abac-aiac*abab)/(abac*abac-abab*acac)), //-abs
           kab=((aiac*abac-aiab*acac)/(abac*abac-abab*acac)); //-abs
          return [kab, kac];
    },

    rotateZ: function(u, angle) {
        var z=[0,0];
        z[0] = Math.cos(angle)*u[0] + Math.sin(angle)*u[1];
        z[1] = -Math.sin(angle)*u[0] + Math.cos(angle)*u[1];
        z[2] = u[2];
        return z;
    },

    //distance between point P and segment AB
    distPtSeg:function(P,A,B) {
         var AB=this.subNew(B,A);
         var nAB2=this.norm2(AB);
         var u=((P[0]-A[0])*(B[0]-A[0])+(P[1]-A[1])*(B[1]-A[1])+(P[2]-A[2])*(B[2]-A[2]))/nAB2;
         var x=A[0]+u*(B[0]-A[0]),
            y=A[1]+u*(B[1]-A[1]),
            z=A[2]+u*(B[2]-A[2]);
            return {dist : this.distance([x,y,z], P), u:u};
    },

    //return the intersection between segment [A,B] and plane z=0
    intersectSegPlaneZ0: function(A,B) {
        var AB=this.subNew(B,A);
        if (AB[2]==0) return false;
        var k=-A[2]/AB[2];
        if (k>0) return false;
        if (k<-1) return false;
        return [A[0]+k*AB[0], A[1]+k*AB[1], 0];
    },

    //return angle between 2 vectors
    get_angle: function(u,v) {
        return Math.acos(this.dot(u,v)/(this.norm(u)*this.norm(v)));
    },

    //rotate vector
    rotateNew: function(axis, angle, v) {
        var m=lib_matrix_rot.rotNew(axis, angle);
        return lib_matrix_base3.multNew(m, v);
    }
};


