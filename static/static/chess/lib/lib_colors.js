var lib_colors={
   //return a 4 array from a string of type "rgb(r,g,b,a)"
   parse: function(rgb) {
       var rgbstr=rgb.replace("rgb(", "").replace(")","").replace("rgba(","");
       var rgbArray= rgbstr.split(",");
       lib_array.parseFloat(rgbArray);
       if (rgbArray.length==3) rgbArray.push(1);
       return rgbArray;
   },

   toString: function(rgbArray) {
       return 'rgba('+rgbArray[0]+","+rgbArray[1]+","+rgbArray[2]+","+rgbArray[3]+")";
   },

   lighten:  function(rgbStr, coeffHSV) {
       var rgbArray=this.parse(rgbStr);
       var rgb=this.rgb_to_rgb01(rgbArray.slice(0,3));
       var tsv=this.rgb01_to_tsv(rgb);
       for (var i=0; i<3; i++) tsv[i]=Math.min(1, tsv[i]+coeffHSV[i]/255);

       rgb=this.rgb01_to_rgb(this.tsv_to_rgb01(tsv));
       if (rgbArray.length==4) rgb.push(rgbArray[3]);
       return this.toString(rgb);
   },

   //coeffs: [H, S, V, add, alphaAdd]
   lighten2:  function(rgbStr, coeffs) {
       var rgbArray=this.parse(rgbStr);
       var rgb=this.rgb_to_rgb01(rgbArray.slice(0,3));
       var tsv=this.rgb01_to_tsv(rgb);
       for (var i=0; i<3; i++) tsv[i]=lib_maths.clamp((tsv[i]*coeffs[i])+coeffs[3]*(coeffs[i]-1), 0,1);

       rgb=this.rgb01_to_rgb(this.tsv_to_rgb01(tsv));
       if (rgbArray.length==4) rgb.push(lib_maths.clamp(rgbArray[3]+coeffs[4],0,1));
       return this.toString(rgb);
   },

   rgb_to_rgb01: function(rgb) {
        return [rgb[0]/255, rgb[1]/255, rgb[2]/255];
   },

   rgb01_to_rgb: function(rgb) {
        return [Math.round(rgb[0]*255), Math.round(rgb[1]*255), Math.round(rgb[2]*255)];
   },

   //s,v,r,g,b in [0,1], t in [0,1]
   //http://fr.wikipedia.org/wiki/Teinte_Saturation_Valeur
   tsv_to_rgb01: function(tsv) {
       var t=tsv[0]*360, s=tsv[1], v=tsv[2];
        var ti=Math.floor(t/60)%6;
        var f=t/60-ti;
        var l=v*(1-s);
        var m=v*(1-f*s);
        var n=v*(1-(1-f)*s);
        switch(ti) {
            case 0:
                return [v,n,l];
                break;
            case 1:
                return [m,v,l];
                break;
             case 2:
                return [l,v,n];
                break;
            case 3:
                return [l,m,v];
                break;
            case 4:
                return [n,l,v];
                break;
            case 5:
                return [v,l,m];
                break;
        }
    },
    
   //s,v,r,g,b in [0,1], t in [0,360]
   //http://fr.wikipedia.org/wiki/Teinte_Saturation_Valeur
    rgb01_to_tsv: function(rgb) {
        var r=rgb[0], g=rgb[1], b=rgb[2];
        var max=Math.max(r,g,b),
            min=Math.min(r,g,b),
            t,s,v;
        switch(max) {
            case min:
                t=0;
                break;
            case r:
                t=(60*(g-b)/(max-min)+360)%360;
                break;
            case g:
                t=(60*(b-r)/(max-min)+120);
                break;
            case b:
                t=(60*(r-g)/(max-min)+240);
                break;
        }
        if (max==0) {
            s=0;
        } else {
            s=1-min/max;
        }
        v=max;
        return [t/360,s,v];
    },

    //convert a float between 0 and 1 to a RGB color
    floatToRgb: function(f) {
        var c=Math.round(f*256*256*256);
        return "#"+c.toString(16);
    }

};