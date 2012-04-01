<?

    $tests=array("RotatingCube", "testMarchingCubes");

    $test=$_GET['test'];
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>
     <style type="text/css">
        body {background-color: black;}
        .testMenu {position: absolute; top: 0px; left: 0px; display: block; opacity: 0.7; width: 150px; height: auto; background-color: white; color: black; font-size: 10pt; padding: 5px;}
        .testMenu a{text-decoration: none; color: black;}
        .testMenu a:hover{color: red;}
     </style>
     <script type="text/javascript" src="scriptDev.php?test=<? echo $test; ?>.js"></script>
    </head>

    <body onload="<? if ($test!="") echo "Game({canvasId: 'canvas3d', rootDir: '../'});"; ?>">
        <div class="testMenu">
        <? //display test list
            foreach ($tests as $test) {
                echo "<a href='?test=$test'>$test</a><br/>";
            }

        ?>
        </div>


       <canvas id="canvas3d" width="800" height="600"></canvas>
    </body>
</html>
