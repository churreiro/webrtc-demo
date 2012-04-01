<?php

    function stripShader($shader) {
        $jsShader=$shader;
        $jsShader=str_replace("\n", "\\n\\\n", $jsShader);
        return $jsShader;
    }

    $fragment=stripShader(file_get_contents("js/Webgl/Shaders/Shader_fragment.gl"));
    $vertex=stripShader(file_get_contents("js/Webgl/Shaders/Shader_vertex.gl"));
    $shaders=file_get_contents("js/Webgl/Shaders/Shaders.js");

    $shaders=str_replace("\$VERTEX\$", $vertex, $shaders);
    $shaders=str_replace("\$FRAGMENT\$", $fragment, $shaders);

    echo $shaders;
?>
