<?
//libs
    include("../lib/libs.php");

//webgl
    include("js/Webgl/windowAnimationFrame.js");
    include("js/Webgl/Shaders/Shaders.php");
    include("js/Webgl/Buffers/VertexBuffer.js");
    include("js/Webgl/Buffers/VertexIndexBuffer.js");
    include("js/Webgl/Matrix.js");


    include("js/Textures/Texture.js");
    include("js/Textures/TextureCanvas.js");
    include("js/Textures/TextureVideo.js");

    include("js/Renders.js");

    include("js/Scene.js");
    include("js/View.js");
    include("js/Navigation.js");
    include("js/Context3D.js");

    include("js/Obj/Obj.js");
    include("js/Obj/JSONobj.js");
    include("js/Obj/SkydomeObj.js");
    include("js/Obj/VideoScreenObj.js");

    include("js/Meshes/Mesh.js");
    include("js/Meshes/Procedural/Primitives/Pave.js");
    include("js/Meshes/Procedural/Primitives/Quad.js");
    include("js/Meshes/Procedural/Primitives/Skydome.js");

//Engine 3D
    include("js/Audiotrack.js");
    include("js/Webrtc.js");
    include("Engine3D.js");

//colliders
    include("js/Colliders/Ray.js");
    include("js/Colliders/Cube.js");
    include("js/Colliders/Octree.js");
    include("js/Colliders/QuadCollider.js");

    include("js/Game.js");

//params
    include("params.js");


//chess :)
    include("js/chess/chess.php");

?>