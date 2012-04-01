
var lib_maths = {
    // return a random int >= a and <= b
    randomInt: function (a, b) {
        var ziou = Math.random();
        return Math.round(ziou*parseFloat(b-a) + parseFloat(a));
    },

    //rad to degrees
    radToDeg: function(angle) {
        return angle*180/Math.PI;
    },

    //degrees to rad
    degToRad: function(angle) {
        return angle*Math.PI/180;
    },

    //round
    round : function(n, d) {
        var p=Math.pow(10, d);
        return Math.round(n*p)/p;
    },

    //put an angle between PI and -PI
    piterval: function(a) {
        while(a<-Math.PI) a+=2*Math.PI;
        while(a>Math.PI) a-=2*Math.PI;
        return a;
    },

     //put an angle between PI/2 and -PI/2
    piterval2: function(a) {
        while(a<-Math.PI*0.5) a+=Math.PI;
        while(a>Math.PI*0.5) a-=Math.PI;
        return a;
    },

    //return decimal part of n
    decimalPart: function(n) {
        return n-Math.round(n);
    },

    pow2: function(x) {
        return x*x;
    },

    clamp: function(x,min,max) {
        return Math.min(Math.max(x, min), max);
    },

    pythagore: function(x,y) {
        return Math.sqrt(x*x+y*y);
    },

    //return the angle between a and the nearest NPI/2 angle
    angle_near_right: function(a) {
        return Math.abs(a)%(Math.PI/2);
    }
};