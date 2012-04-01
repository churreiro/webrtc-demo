/*
 * spec :
 * w : with
 * h : height
 * d : depth
 *
 */
var Pave=function(spec) {
    var w2=spec.w/2, h2=spec.h/2, d2=spec.d/2;
    var positions = [
    // Front face
    -w2, -h2,  d2,
    w2, -h2,  d2,
    w2,  h2,  d2,
    -w2,  h2,  d2,

    // Back face
    -w2, -h2, -d2,
    -w2,  h2, -d2,
    w2,  h2, -d2,
    w2, -h2, -d2,

    // Top face
    -w2,  h2, -d2,
    -w2,  h2,  d2,
    w2,  h2,  d2,
    w2,  h2, -d2,

    // Bottom face
    -w2, -h2, -d2,
    w2, -h2, -d2,
    w2, -h2,  d2,
    -w2, -h2,  d2,

    // Right face
    w2, -h2, -d2,
    w2,  h2, -d2,
    w2,  h2,  d2,
    w2, -h2,  d2,

    // Left face
    -w2, -h2, -d2,
    -w2, -h2,  d2,
    -w2,  h2,  d2,
    -w2,  h2, -d2
    ];

    var textureCoords = [
    // Front face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Back face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Top face
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Bottom face
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    // Right face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Left face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0
    ];

    var normals=[
    0,0,1,  0,0,1,  0,0,1,  0,0,1,
    0,0,-1,  0,0,-1,  0,0,-1,  0,0,-1,
    0,1,0,  0,1,0,  0,1,0,  0,1,0,
    0,-1,0,  0,-1,0,  0,-1,0,  0,-1,0,
    1,0,0,  1,0,0,  1,0,0,  1,0,0,
    -1,0,0,  -1,0,0,  -1,0,0,  -1,0,0
    ]

    var vi = [
    0, 1, 2,      0, 2, 3,    // Front face
    4, 5, 6,      4, 6, 7,    // Back face
    8, 9, 10,     8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  // Left face
    ];

    var vb=lib_buffersArray.concat(positions, normals, textureCoords);
    var that=Mesh({
        vertexBufferArray: vb,
        vertexIndexBufferArray: vi
    });
    return that;
};

