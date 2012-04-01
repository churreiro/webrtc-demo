var Shaders=function(spec){
    var that={

    getShader:function(gl, id) {  
    	var shaderScript, theSource, currentChild, shader;  
      
    	shaderScript = document.getElementById(id);  
      
    	if (!shaderScript) {  
        	return null;  
    	}  
      
    	theSource = "";  
    	currentChild = shaderScript.firstChild;  
      
   	 
   		while(currentChild) {  
        	if (currentChild.nodeType == currentChild.TEXT_NODE) {  
            	theSource += currentChild.textContent;  
        	}  
        	currentChild = currentChild.nextSibling; 
        }
        
		if (shaderScript.type == "x-shader/x-fragment") {  
    		shader = gl.createShader(gl.FRAGMENT_SHADER);  
  		} else if (shaderScript.type == "x-shader/x-vertex") {  
    		shader = gl.createShader(gl.VERTEX_SHADER);  
  		} else {  
     		// Unknown shader type  
     		return null;  
  		}         
  		gl.shaderSource(shader, theSource);  
      
  		// Compile the shader program  
  		gl.compileShader(shader);    
      
  		// See if it compiled successfully  
  		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {    
      		alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));    
      		return null;    
  		}  
      
  		return shader;  

    },  
    
    getFragmentShader:function() {
           //var src="$FRAGMENT$";
           //var src= "Shader_fragment.gl";
           
           //var shader = GL.createShader(GL.FRAGMENT_SHADER);
           var fragmentShader = this.getShader(GL, "shader-fs")
           
           //var shader = GL.createShader(this.responseText);
            //GL.shaderSource(shader, src);
            //GL.compileShader(shader);
            /*if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
                if (DEBUG) alert(GL.getShaderInfoLog(shader));
                return null;
            }*/
            return fragmentShader;
    },

    getVertexShader:function() {
            //var src="$VERTEX$";
            var src="Shader_vertex.gl";
            var vertexShader = this.getShader(GL, "shader-vs"); 
            
            /*
            //var shader = GL.createShader(GL.VERTEX_SHADER);
            var shader = GL.createShader(this.responseText);
            GL.shaderSource(shader, src);
            GL.compileShader(shader);
            if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
                alert(GL.getShaderInfoLog(shader));
                return null;
            }
            */
            return vertexShader;
    },



    init: function() {
        //that.has_derivatives = !!GL.getExtension('OES_standard_derivatives');
        that.fragmentShader = that.getFragmentShader();
        that.vertexShader =that.getVertexShader();

        that.SHADER_PROGRAM = GL.createProgram();        
        GL.attachShader(that.SHADER_PROGRAM, that.vertexShader);
        GL.attachShader(that.SHADER_PROGRAM, that.fragmentShader);
        GL.linkProgram(that.SHADER_PROGRAM);

        if (!GL.getProgramParameter(that.SHADER_PROGRAM, GL.LINK_STATUS)) {
            if (DEBUG) alert("Could not initialise shaders");
            return false;
        }

        //attributes
        that.SHADER_PROGRAM.vertexPositionAttribute = GL.getAttribLocation(that.SHADER_PROGRAM, "aVertexPosition");
        
        that.SHADER_PROGRAM.textureCoordAttribute = GL.getAttribLocation(that.SHADER_PROGRAM, "aTextureCoord");
        
        that.SHADER_PROGRAM.vertexNormalAttribute = GL.getAttribLocation(that.SHADER_PROGRAM, "aVertexNormal");


        that.SHADER_PROGRAM.pMatrixUniform = GL.getUniformLocation(that.SHADER_PROGRAM, "uPMatrix");
        that.SHADER_PROGRAM.mvMatrixUniform = GL.getUniformLocation(that.SHADER_PROGRAM, "uMVMatrix");
        that.SHADER_PROGRAM.shadow = GL.getUniformLocation(that.SHADER_PROGRAM, "shadow");
        
        that.SHADER_PROGRAM.uSamplers = GL.getUniformLocation(that.SHADER_PROGRAM, "uSampler0");
        that.SHADER_PROGRAM.white = GL.getUniformLocation(that.SHADER_PROGRAM, "white");
        that.SHADER_PROGRAM.screenRed = GL.getUniformLocation(that.SHADER_PROGRAM, "screenRed");

        //object
        that.SHADER_PROGRAM.render = GL.getUniformLocation(that.SHADER_PROGRAM, "render");        
        that.SHADER_PROGRAM.OBJ_Matrix=GL.getUniformLocation(that.SHADER_PROGRAM, "OBJ_Matrix");
        that.SHADER_PROGRAM.V_Matrix=GL.getUniformLocation(that.SHADER_PROGRAM, "V_Matrix");
        that.SHADER_PROGRAM.cam_pos=GL.getUniformLocation(that.SHADER_PROGRAM, "cam_pos");

        that.set();
    },

    set: function() {
            GL.enableVertexAttribArray(that.SHADER_PROGRAM.vertexPositionAttribute);
        
        GL.enableVertexAttribArray(that.SHADER_PROGRAM.vertexNormalAttribute);
GL.enableVertexAttribArray(that.SHADER_PROGRAM.textureCoordAttribute);

       // GL.enableVertexAttribArray(that.SHADER_PROGRAM.textureCoordAttribute);
        GL.useProgram(that.SHADER_PROGRAM);
        SHADER_PROGRAM=that.SHADER_PROGRAM;
    },

    unset: function() {        
        GL.disableVertexAttribArray(that.SHADER_PROGRAM.textureCoordAttribute);
    }
    }//end that
    that.init();
    return that;
};


