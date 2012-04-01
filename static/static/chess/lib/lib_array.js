var lib_array={
    //apply function f to all elements of a
    mapMethod: function(a, f) {
        for (var i=0; i<a.length; i++) a[i][f]();
    },

    mapMethod1Arg: function(a, f, arg1) {
        for (var i=0; i<a.length; i++) a[i][f](arg1);
    },

    mapMethod2Args: function(a, f, arg1, arg2) {
        for (var i=0; i<a.length; i++) a[i][f](arg1, arg2);
    },


    mapFunc: function(a,f) {
        for (var i=0; i<a.length; i++) f(a[i]);
    },
   
    //delete all elements of a specified in the index array ia
    delIndices: function(a, ia) {
        ia.sort();
        var offset=0;
        for (var i=0; i<ia.length; i++) {
            a.splice(ia[i]-offset,1);
            offset++;
        }
    },

    //check if all elements of array a are differents
    checkIfDifferents: function(a) {
        for (var i=0; i<a.length; i++) {
            for (var j=i+1; j<a.length; j++) {
                if (a[i]==a[j]) return false;
            }
        }
        return true;
    },

    //delete the element elt of the array a
    removeElement:function(a,elt) {
        var i=a.indexOf(elt);
        if (i==-1) return false;
        a.splice(i,1);
        return true;
    },

    //replace the element elt by eltNew in array a
    replaceElement: function(a, elt, eltNew) {
      var i=a.indexOf(elt);
      if (i==-1) return false;
      a.splice(i, 1, eltNew);
      if (!this.replaceElement(a,elt,eltNew)) return true;
    },

    //search if an element has attribute attrib
    searchAttribute:function(a, attrib) {
        for (var i=0; i<a.length; i++) {
            if (a[i][attrib]) return a[i];
        }
        return false;
    },

    parseFloat: function(a) {
        for (var i=0; i<a.length; i++) {
            a[i]=parseFloat(a[i]);
        }
    },

    pushOnce: function(a, elt) {
        if (a.indexOf(elt)!=-1) return false;
        a.push(elt);
        return true;
    },

    copy: function(a) {
        var r=[];
        for (var i=0; i<a.length; i++) r.push(a[i]);
        return r;
    },

    copy2: function(a) {
        var r=[];
        for (var i=0; i<a.length; i++) r.push(this.copy(a[i]));
        return r;
    },

    flatten: function(a) {
        var r=[];
        for (var i=0; i<a.length; i++) {
            r=r.concat(a[i]);
        }
        return r;
    }

};

