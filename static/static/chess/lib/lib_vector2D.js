
var lib_vector = {
    affect: function(u, v) {u[0] = v[0];u[1] = v[1];},
    middle: function(a,b) {return [(a[0]+b[0])*0.5, (a[1]+b[1])*0.5];},
    norm2: function (a) {return a[0]*a[0] + a[1]*a[1];},
    norm: function(a) {return Math.sqrt(this.norm2(a));},
    sub: function(u,v) {u[0]-=v[0];u[1]-=v[1];},
    subNew: function (u, v) {return [u[0] - v[0], u[1] - v[1]];},
    add: function(u, v) {u[0]+=v[0];u[1]+=v[1];},
    addHalfNew: function(u,v) {return [u[0]+0.5*v[0], u[1]+0.5*v[1]];},
    addNew: function (u, v) {return [u[0] + v[0], u[1] + v[1]];},
    scaleNew: function (u, s) {return [u[0]*s, u[1]*s];},
    scale: function(u, s) {u[0]*=s;u[1]*=s;},
    madd: function (u, v, alpha, beta) {return [alpha*u[0] + beta*v[0], alpha*u[1] + beta*v[1]];},
    copy: function (u) {return [u[0], u[1]];},
    dot: function(u,v) {return u[0]*v[0]+u[1]*v[1];},
    det: function(a,b) {return a[0]*b[1]-a[1]*b[0];},
    invert:function(a) {a[0]*=-1;a[1]*=-1;},
    invertNew:function(a) {return [-a[0], -a[1]];},
    angleFromX: function(u) {return Math.atan2(u[1], u[0]);},
    angleFromY: function(u) {return Math.atan2(u[0], u[1]);},
    scaleXY: function(u,s) {return [u[0]*s[0], u[1]*s[1]];},
    divideXY: function(u,s) {u[0]/=s[0];u[1]/=s[1];},
    mixNew: function(u,v,t) {return [u[0]*t+v[0]*(1-t), u[1]*t+v[1]*(1-t)];},
    halfNew: function(u) {return [u[0]*0.5, u[1]*0.5];},
    fmaNew: function(u, v, s) {return [u[0]*s+v[0], u[1]*s+v[1]];},
    get3D: function(u) {return [u[0], u[1], 0];},
    rotateHalfPi: function(u) {var u0=u[0]; u[0]=u[1]; u[1]=u0},
    get_unit: function(A, B) {
       var AB=this.subNew(B,A);
       this.normalize(AB);
       return AB;        
    },

    addN: function() {
        var u=arguments[0];
        for (var i=1; i<arguments.length; i++) {
           u[0]+=arguments[i][0];
           u[1]+=arguments[i][1];
        };
    },

    addNNew: function() {
        var u=[arguments[0][0], arguments[0][1]];
        for (var i=1; i<arguments.length; i++) {
           u[0]+=arguments[i][0];
           u[1]+=arguments[i][1];
        };
        return u;
    },

    // rotate u of an angle theta around 0 and return the result
    rotateNew: function (u, theta) {
        var cost = Math.cos(theta);
        var sint = Math.sin(theta);
        var zou = [];
        zou[0] = cost*(u[0]) + sint*(u[1]);
        zou[1] = -sint*(u[0]) + cost*(u[1]);
        return zou;
    },

    rotate: function (u, theta) {
        var cost = Math.cos(theta);
        var sint = Math.sin(theta);
        var u0 = u[0];
        u[0] = cost*(u[0]) + sint*(u[1]);
        u[1] = -sint*u0 + cost*(u[1]);
    },

    //rotate a point
    rotatePointNew: function(P, C, theta) {
       var p=this.subNew(P,C);
       p=this.rotateNew(p, theta);
       return this.addNew(p, C);
    },

    rotatePoint: function(P,C,theta){
       var p=this.subNew(P,C);
       p=this.rotateNew(p, theta);
       P=this.addNew(p, C);
    },
    
    normalize: function (u) {
        var n = 1. / this.norm(u);
        u[0]*=n;
        u[1]*=n;
    },

    normalizeNew: function (u) {
        var n = 1. / this.norm(u);
        return [u[0]*n,u[1]*n];
    },

    normal: function (u) {
        var n = 1. / Math.sqrt(this.norm2(u));
        return [u[0]*n, u[1]*n];
    },
    
    //return the projection vector of u on the unit vector v
    proj: function(u,v) {
        var s=this.dot(u,v);
        return [v[0]*s, v[1]*s];
    },

    //return angle between normalized vectors u and v
    angle: function(u,v) {
        var cos=this.dot(u,v);
        var sin=this.det(u,v);
        return Math.atan2(sin,cos);
    },

    angleGen: function(u,v) {
        var norms=this.norm(u)*this.norm(v);
        var cos=this.dot(u,v)/norms;
        var sin=this.det(u,v)/norms;
        var angle=Math.atan2(sin,cos);
       
        return angle;
    },

    //return distance between 2 points
    distance: function(a,b) {
        var d=this.subNew(a,b);
        return this.norm(d);
    },

    distance2: function(a,b) {
        var d=this.subNew(a,b);
        return this.norm2(d);
    },

    //distance between point P and segment AB
    distPtSeg:function(P,A,B) {
         var AB=this.subNew(B,A);
         var nAB2=this.norm2(AB);
         var u=((P[0]-A[0])*(B[0]-A[0])+(P[1]-A[1])*(B[1]-A[1]))/nAB2;
         var x=A[0]+u*(B[0]-A[0]),
            y=A[1]+u*(B[1]-A[1]);
            return this.distance([x,y], P);
    },

    //distance between point P and segment AB, hight number if P cannot be in seg [A,B]
    distPtSegInside:function(P,A,B) {
         var AB=this.subNew(B,A);
         var nAB2=this.norm2(AB);
         var u=((P[0]-A[0])*(B[0]-A[0])+(P[1]-A[1])*(B[1]-A[1]))/nAB2;
         if (u<0 || u>1) return 9999999999;
         var x=A[0]+u*(B[0]-A[0]),
            y=A[1]+u*(B[1]-A[1]);
            return this.distance([x,y], P);
    },

    //return the distance between AB and CD
    //AB is the ref segment
    distSegSegInside: function(A,B,C,D) {
       var P1=this.distPtSegInside(C, A, B);
       if (!P1) return false;
       var P2=this.distPtSegInside(D, A, B);
       if (!P2) return false;
       return 0.5*(P1+P2);
    },

    //return normalized vector perpendicular to u
    getPerp: function(u) {
        var v=[u[1], -u[0]];
        this.normalize(v);
        return v;
    },

    //return the orthogonal projection of P on segment [AB]
    projSeg: function(P,A,B) {
         var AB=this.subNew(B,A);
         var nAB2=this.norm2(AB);
         var u=((P[0]-A[0])*(B[0]-A[0])+(P[1]-A[1])*(B[1]-A[1]))/nAB2;
         return [A[0]+u*(B[0]-A[0]),A[1]+u*(B[1]-A[1])];
    },

    //return the orthogonal projection of P on line (A, u) u must be normalized !!!
    projLine: function(P,A,u) {
        var k=(P[0]-A[0])*u[0]+(P[1]-A[1])*u[1];
        return [A[0]+k*u[0],A[1]+k*u[1]];
    },

    //return the orthogonal projection of P on segment [AB], and false if the proj is not in [AB]
    projSegInside: function(P,A,B) {
         var AB=this.subNew(B,A);
         var nAB2=this.norm2(AB);
         var u=((P[0]-A[0])*(B[0]-A[0])+(P[1]-A[1])*(B[1]-A[1]))/nAB2;
         if (u<0 || u>1) return false;
         return [A[0]+u*(B[0]-A[0]),A[1]+u*(B[1]-A[1])];
    },

    buildFromAngle: function(angle, size) {
        return [Math.cos(angle)*size, Math.sin(angle)*size];
    },

    //return angle bac
    getAnglePoints: function(a,b,c) {
        var ab=lib_vector.subNew(b,a),
            ac=lib_vector.subNew(c,a);
        return Math.atan2(this.det(ab, ac), this.dot(ab, ac));
    },

    //compute the bissectrice on point B
    bissect: function(A,B,C) {
        var u=lib_vector.subNew(B,A),
            v=lib_vector.subNew(B,C);
        var nu=this.norm(u),
            nv=this.norm(v);
        var bis=lib_vector.madd(u,v,nv,nu);
        lib_vector.normalize(bis);
        return bis;
    },

    //check if line (O, u) intersect segment [AB]
    intersectSegLine: function(A,B,O,u) {
        var oa=lib_vector.subNew(A,O),
            ob=lib_vector.subNew(B,O);
        if (this.dot(oa,u)<0 && this.dot(ob,u)<0) return false;
        if (this.det(oa, u)*this.det(ob, u)<0) return true;
          return false;
    },

    //check if segment [AB] intersect [CD]
    intersectSegSeg: function(A,B,C,D) {
        var ac=this.subNew(C,A),
            ad=this.subNew(D,A),
            ab=this.subNew(B,A);
        if (this.det(ab,ac)*this.det(ab,ad)>=0) return false;
        this.invert(ac);
        var cb=this.subNew(B,C),
            cd=this.subNew(D,C);
        if (this.det(cd,ac)*this.det(cd,cb)>=0) return false;
        return true;
    },

    //returns intersection of line (A,u) with line (B,v)
    //u and v are normalized
    intersectLineLine: function(A,u,B,v) {
        var detuv=this.det(u,v);
        if (detuv==0) return false; //line are parallel
        var detAv=this.det(A,v),
            detBv=this.det(B,v);
        var alpha=(detBv-detAv)/detuv;
        return this.addNew(A, this.scaleNew(u,alpha));
    },

    //return intersection point between 2 segment and false if not intersect
    intersectSegSegInside: function(A,B,C,D) {
        var AB=this.subNew(B,A),
            CD=this.subNew(D,C),
            CA=this.subNew(A,C),
            AC=this.subNew(C,A);
        var ABAC=this.det(AB, AC),
            ABCD=this.det(AB, CD),
            CDCA=this.det(CD, CA);
        if (ABCD==0) return false; //parallel segments
        var a=CDCA/ABCD,
            b=-ABAC/ABCD;
        if (a<0 || a>1) return false;
        if (b<0 || b>1) return false;
        this.scale(AB, a); //AB becomes AI
        return lib_vector.addNew(A, AB);
    },

    //return angle between seg [A,B] and Ox
    angleSegFromX: function(A,B) {
        var AB=this.subNew(B,A);
        return this.angleFromX(AB);
    }

};