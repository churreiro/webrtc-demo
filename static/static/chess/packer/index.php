<?

    echo "Clean all<br>";
    system("rm -Rf ../build/*");
    //make script.js
    $outPutFile="../build/script.js";
    $sourceURL=dirname("http://$_SERVER[SERVER_NAME]$_SERVER[SCRIPT_NAME]/")."/../engine3D/Engine3D.php";

    echo "Copy $sourceURL to $outPutFile<br/>";


    $source=file_get_contents($sourceURL);
    $source=str_replace("troubleshooting.php", "troubleshooting.html", $source);
    $tmpFile="tmp/script.js";
    file_put_contents($tmpFile, $source);
    system("java -jar compiler.jar --js=$tmpFile --js_output_file=$outPutFile");
    
    
    $outPutFile="../build/index.html";
    $sourceURL=dirname("http://$_SERVER[SERVER_NAME]$_SERVER[SCRIPT_NAME]/")."/../index.php";
    echo "Copy $sourceURL to $outPutFile...<br/>";
    $source=file_get_contents($sourceURL);
    $source=str_replace("engine3D/Engine3D.php", "script.js", $source);
    file_put_contents($outPutFile, $source);

    echo "Copy troubleshootings";
    copy("../troubleshooting.php", "../build/troubleshooting.html");

    echo "Copy images<br/>";
        system("cp -R ../images ../build");

    echo "Copy style<br/>";
    system("cp -R ../css ../build");

    echo 'Copy sounds<br/>';
    system("cp -R ../sounds ../build");

    echo 'copy ressources<br/>';
    mkdir("../build/engine3D");
    mkdir("../build/engine3D/ressources");
    mkdir("../build/engine3D/ressources/Board");
    copy("../engine3D/ressources/Board/board.json",  "../build/engine3D/ressources/Board/board.json");
    copy("../engine3D/ressources/Board/wood.jpg",  "../build/engine3D/ressources/Board/wood.jpg");

    mkdir("../build/engine3D/ressources/Tower");
    copy("../engine3D/ressources/Tower/tower.json",  "../build/engine3D/ressources/Tower/tower.json");

    mkdir("../build/engine3D/ressources/chess");
    mkdir("../build/engine3D/ressources/chess/Bishop");
    copy("../engine3D/ressources/chess/Bishop/bishop.json", "../build/engine3D/ressources/chess/Bishop/bishop.json");
    copy("../engine3D/ressources/chess/Bishop/bake.png", "../build/engine3D/ressources/chess/Bishop/bake.png");

    mkdir("../build/engine3D/ressources/chess/King");
    copy("../engine3D/ressources/chess/King/king.json", "../build/engine3D/ressources/chess/King/king.json");
    copy("../engine3D/ressources/chess/King/bake.png", "../build/engine3D/ressources/chess/King/bake.png");

    mkdir("../build/engine3D/ressources/chess/Knight");
    copy("../engine3D/ressources/chess/Knight/knight.json", "../build/engine3D/ressources/chess/Knight/knight.json");
    copy("../engine3D/ressources/chess/Knight/bake.png", "../build/engine3D/ressources/chess/Knight/bake.png");

    mkdir("../build/engine3D/ressources/chess/Pawn");
    copy("../engine3D/ressources/chess/Pawn/pawn.json", "../build/engine3D/ressources/chess/Pawn/pawn.json");
    copy("../engine3D/ressources/chess/Pawn/bake.png", "../build/engine3D/ressources/chess/Pawn/bake.png");

    mkdir("../build/engine3D/ressources/chess/Queen");
    copy("../engine3D/ressources/chess/Queen/queen.json", "../build/engine3D/ressources/chess/Queen/queen.json");
    copy("../engine3D/ressources/chess/Queen/bake.png", "../build/engine3D/ressources/chess/Queen/bake.png");

    mkdir("../build/engine3D/ressources/chess/Rook");
    copy("../engine3D/ressources/chess/Rook/rook.json", "../build/engine3D/ressources/chess/Rook/rook.json");
    copy("../engine3D/ressources/chess/Rook/bake.png", "../build/engine3D/ressources/chess/Rook/bake.png");

    copy("../engine3D/ressources/chess/white.jpg", "../build/engine3D/ressources/chess/white.jpg");
    copy("../engine3D/ressources/chess/black.jpg", "../build/engine3D/ressources/chess/black.jpg");

    copy("../engine3D/ressources/ground.jpg",  "../build/engine3D/ressources/ground.jpg");
    copy("../engine3D/ressources/waitScreen.jpg",  "../build/engine3D/ressources/waitScreen.jpg");

    copy("../README.TXT", "../build/README.TXT");
    copy("../LICENCE.TXT", "../build/LICENCE.TXT");

    echo "Copy server";
    mkdir("../build/server");
    copy("../server/peerconnection_server", "../build/server/peerconnection_server");

    
    echo "Built ! Check it <a href='../build'>HERE</a>";

    @unlink($tmpFile);

?>
