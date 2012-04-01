<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="css/style.css"/>
        <title>.: CHESS CAM :.</title>
        
        <script type='text/javascript' src='engine3D/Engine3D.php'></script>
        <? include("font.php"); ?>
        <script type='text/javascript'>
            var ENGINE3D;
            function main() {
                ENGINE3D=new Engine3D({canvasId: "canvas3d", fullScreen: true});
                ENGINE3D.init();
                ENGINE3D.start();
            }
        </script>

    </head>
    <body style="margin: 0px" onload="main();">
        <div class="canvasDiv" id="canvasDiv">
            <canvas style="-webkit-filter: blur(5px); -webkit-transition-duration: 1s" id="canvas3d" class="canvas3d" width="800" height="520"></canvas>
        </div>
        
        <?
            include("connect.php");
            include("credits.php");
        ?>


        <video width="240" height="120" class="localView" id="localView" autoplay="autoplay"></video>
        <a class="controls" onclick="GAME.restart()">RESTART</a>
        <a class="credits" onclick="lib_dom.hideShow('credits_win')">CREDITS</a>
        <div class="infos" id="infosChess"></div>

        <video width="512" height="512" class="remoteView" id="remoteView" autoplay="autoplay"></video>
    </body>
</html>