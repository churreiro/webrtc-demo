/*
 *spec :
 *R: radius
 *phi0 : start angle in rad
 *rings : number of rings
 *bands : number of bands
 *
 */

var Skydome=function(spec) {
            spec.vertices=[],
            spec.indices=[];
            var r, b, phi, theta, dphi, dtheta, i=0;
            dphi=spec.phi0/spec.rings;
            dtheta=2*Math.PI/spec.bands;
            for (r=0; r<=spec.rings; r++) { //for each ring
                phi=r*dphi;
                for (b=0; b<=spec.bands; b++) { //for each band
                    theta=b*dtheta;
                    spec.vertices.push(
                        spec.R*Math.sin(phi)*Math.cos(theta),   //X
                        spec.R*Math.sin(phi)*Math.sin(theta),   //Y
                        spec.R*Math.cos(phi),                   //Z
                        Math.sin(phi)*Math.cos(theta),          //NX
                        Math.sin(phi)*Math.sin(theta),          //NY
                        Math.cos(phi),                          //NZ
                        //0.5+0.5*Math.sin(phi)*Math.cos(theta),  //U
                        //0.5+0.5*Math.sin(phi)*Math.sin(theta)  //V
                        (theta*(1+1/dtheta))/(2*Math.PI),                        //U
                        (Math.PI-phi)/Math.PI                              //V
                    );
                    if (r!=0) {
                        spec.indices.push(i-1, i, i-spec.bands-1,
                                         i-1, i-spec.bands-1, i-spec.bands-2);
                    }
                    i++;
                }

            }

            var that=Mesh({
                vertexBufferArray: spec.vertices,
                vertexIndexBufferArray: spec.indices
            });
    return that;
};


