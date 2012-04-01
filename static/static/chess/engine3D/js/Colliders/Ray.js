var Ray=function() {
    var that={
        direction:[0,0,0],
        origin:[0,0,0],
        pluck:[0,0,0,0,0,0],

        //ray parameters in the object referenciel
        objectOrigin:[0,0,0],
        objectDirection:[0,0,0],
        objectPluck:[0,0,0,0,0,0],

        set:function(xy_curs) {
            that.direction[0]=Matrix.pMatrixInv[0]*(Matrix.pick_a*xy_curs[0]-1);
            that.direction[1]=Matrix.pMatrixInv[5]*(Matrix.pick_b*xy_curs[1]+1);
            that.direction[2]=-1;

            //set ray parameter into the scene ref
           VIEW.dirRefScene(that.direction);
           VIEW.orRefScene(that.origin);

           //on normalize K
           var l=Math.sqrt(that.direction[0]*that.direction[0]+that.direction[1]*that.direction[1]+that.direction[2]*that.direction[2]);
           that.direction[0]/=l;that.direction[1]/=l;that.direction[2]/=l;
           //plucker coordinates
           that.pluckerize(that.origin, that.direction, that.pluck);
        },

        //set plucker coordinates
        pluckerize:function(origin, direction, plucker) {
           plucker[0]=origin[0]*direction[1]-direction[0]*origin[1];
           plucker[1]=origin[0]*direction[2]-direction[0]*origin[2];
           plucker[2]=-direction[0];
           plucker[3]=origin[1]*direction[2]-direction[1]*origin[2];
           plucker[4]=-direction[2];
           plucker[5]=direction[1];
        },

        //move the ray to the ref defined by mvMatrix
        changeRef:function(mvMatrix) {
            lib_matrix_mv.moveOrigin(mvMatrix, that.origin, that.objectOrigin);
            lib_matrix_mv.moveDirection(mvMatrix, that.direction,that.objectDirection);
            that.pluckerize(that.objectOrigin, that.objectDirection, that.objectPluck);
        },

        //get side with segment [AB]
        pluckTurn:function(A,B) {
            var ABPluck=[A[0]*B[1]-B[0]*A[1],
                A[0]*B[2]-B[0]*A[2],
                A[0]-B[0],
                A[1]*B[2]-B[1]*A[2],
                A[2]-B[2],
                B[1]-A[1]
            ]
            return that.objectPluck[2]*ABPluck[3]+that.objectPluck[5]*ABPluck[1]+that.objectPluck[4]*ABPluck[0]+that.objectPluck[1]*ABPluck[5]+that.objectPluck[0]*ABPluck[4]+that.objectPluck[3]*ABPluck[2];
        },

       //test if intersect quad defined with sommits a,b,c,d
       intersectQuad:function (a,b,c,d) {
           var signAB=that.pluckTurn(a,b);
           var signBC=that.pluckTurn(b,c);
           if (signAB*signBC<0) return false;
           var signCD=that.pluckTurn(c,d);
           if (signAB*signCD<0) return false;
           var signDA=that.pluckTurn(d,a);
           return (signDA*signAB>=0);
       },

       //same as previous but returns distance
       intersectQuadDist: function(a,b,c,d) {
           if (!that.intersectQuad(a,b,c,d)) return false;
           var k1=that.intersectTri([a,b,c]);
           if (k1) return k1;
           return that.intersectTri([a,c,d]);
       },
   
       intersectSphere : function (r) {
           var a = that.objectOrigin;
           var A = lib_vector3D.dot(a, a) - r*r;
           var B = lib_vector3D.dot(a, that.objectDirection);
           var delta = B*B - A;
           return (delta >= 0)
       },

       //test if intersect tri defined with sommits a,b,c
       //return intersection point in object ref or false
       intersectTri:function(f) {
           var signAB=that.pluckTurn(f[0],f[1]);
           var signBC=that.pluckTurn(f[1],f[2]);
           if (signAB*signBC<0) return false;
           var signCA=that.pluckTurn(f[2],f[0]);
           if (signCA*signAB<0) return false;
           //return intersection distance

           var ab=lib_vector3D.subNew(f[0], f[1]);
           var ac=lib_vector3D.subNew(f[0], f[2]);
           var ag=lib_vector3D.subNew(f[0], that.objectOrigin);

           var k=lib_vector3D.det(that.objectDirection,ab,ac);
           
           //return k;
           return -lib_vector3D.det(ag,ab,ac)/k;

       }
    } //end that
    return that;
};
var RAY=Ray();
