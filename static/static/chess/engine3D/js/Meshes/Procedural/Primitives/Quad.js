/*
 * spec :
 * h : height
 * w : width
 *
 * facultative :
 * textureScale: texture scale
 */

var Quad=function(spec) {
    spec.textureScale=spec.textureScale || 1;
    var positions=[-spec.w/2, -spec.h/2, 0,
                  spec.w/2, -spec.h/2, 0,
                  spec.w/2, spec.h/2, 0,
                  -spec.w/2, spec.h/2, 0];
    var normals=[0,0,1,
                 0,0,1,
                 0,0,1,
                 0,0,1];
    var text_uv=[0,0,
                 spec.textureScale,0,
                 spec.textureScale,spec.textureScale,
                 0,spec.textureScale
                ];

    var vb=lib_buffersArray.concat(positions, normals, text_uv);
    var that=Mesh({
        vertexBufferArray: vb,
        vertexIndexBufferArray: [0,1,2,0,2,3]
    });
    return that;
};

