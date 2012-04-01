var lib_objs={
    //return a copy of obj without methods
    //attribute must be so as testFunc(attr)=true to be copied
    
    overload: function(source, dest) {
       for (var attr in source) {
           dest[attr]=source[attr];
       }  
    },

    mapMethod: function(obj, method) {
       for (var zou in obj) { obj[zou][method](); }
    },

    copyAttributes: function(obj, testFunc) {
        var copy=(obj instanceof(Array))?[]:{};        
        return this.copyAttributesRec(obj, copy, testFunc, [], []);
    },

    copyAttributesRec: function(obj, copy, testFunc, tableObjs, tableObjsCopy) {
        var tableIndex;
        if (!obj) return copy;
        //copy.originalObj=obj;
        if (!testFunc(obj)) return copy;
        for (var attr in obj) {
           if (typeof(obj[attr])=="function") continue; //copy only attributes, not methods
           if (typeof(obj[attr])=="object") {
               if (attr=="originalObj") continue;
               if (obj[attr].childNodes || obj[attr].parentNode) continue; //forbid dom elements
               if (!testFunc(obj[attr]) && !obj[attr] instanceof(Array)) continue; //ne mÃ©rite pas d'etre copiÃ©
              //check if already copied...
              tableIndex=tableObjs.indexOf(obj[attr]);
              if (tableIndex!=-1) { //copy the attribute object by ref
                  copy[attr]=tableObjsCopy[tableIndex];
              } else { //copy the attribute object by value
                  if (!copy[attr]) {
                      copy[attr]=(obj[attr] instanceof(Array))?[]:{};
                      copy[attr].originalObj=obj[attr];
                  }
                  tableObjs.push(obj[attr]);
                  tableObjsCopy.push(copy[attr]);
                  copy[attr]=this.copyAttributesRec(obj[attr], copy[attr], testFunc, tableObjs, tableObjsCopy);                  
              }
           } else { //if obj[attr] is not an object
               copy[attr]=obj[attr];
           }
        };
        return copy;
    },
    
    len: function(obj) {
      var l=0;
      for (var i in obj) l++;
      return l;
    },
    restoreAttributes: function(obj, copy) {
        //retore attributes of the copy
        this.cleanAttributesRec(obj, copy, []);
        this.restoreAttributesRec(copy, []);
        //this.cleanAttributesRec(obj, copy, []);
        //remove attributes which are not in the copy
        this.cleanAttributesRec(obj, copy, []);
    },

    cleanAttributesRec: function(obj, copy, tableObj) {
        if (typeof(obj)!="object") return false;
        var index;
        for (var attr in obj) {            
            if (typeof(obj[attr])!="object") continue;            
            if (attr=='originalObj') continue;
            
            //the obj is not in the copy           
            if (typeof(copy[attr])=="undefined") {
                
                if (obj instanceof(Array)) {
                    if(!obj[attr].doUndo) continue;
                    obj.splice(attr, 1);
                    attr++;
                    //this.cleanAttributesRec(obj[attr], copy[attr], tableObj);
                }else {
                    //delete(obj[attr]);
                }
            } else {
                //console.log("rec");
                if (tableObj.indexOf(obj[attr])!=-1) continue;
                tableObj.push(obj[attr]);
                this.cleanAttributesRec(obj[attr], copy[attr], tableObj);
                
            }

        }

    },

    restoreAttributesRec: function(copy, tableRestored) {
        if (typeof(copy)=="undefined") return false;
        //tableRestored.push(copy);
        var indexCpy;
        for (var attr in copy) {            
            if (attr=='originalObj') continue;            
            if (typeof(copy[attr])=="undefined" || typeof(copy[attr])=="function") continue;
            //if (typeof(copy[attr].originalObj)=="undefined") continue;
            if (copy[attr].childNodes || copy[attr].parentNode) continue;
            if (typeof(copy[attr])=="object") {
                    indexCpy=tableRestored.indexOf(copy[attr]);
                    if (indexCpy!=-1) continue; //already restored
                    tableRestored.push(copy[attr]);

                    if (!copy[attr].originalObj) {                        
                        console.log("lib_objs.restoreAttributesRec : warning");
                        //delete(copy[attr]);
                        //continue;
                    }
                    //tableRestored.push(copy[attr]);
                    if (copy.originalObj instanceof(Array)) {
                        indexCpy=copy.originalObj.indexOf(copy[attr].originalObj);
                        if (indexCpy==-1) {
                             //if (!copy[attr].doUndo) continue;
                             copy.originalObj.splice(attr, 0, copy[attr].originalObj);
                             console.log("sds", attr, indexCpy);
                             
                        } else { //remap the array
                            copy.originalObj[attr]=copy[attr].originalObj;                            
                            if (!copy[attr].doUndo2) this.restoreAttributesRec(copy[attr], tableRestored);
                            continue;
                        }
                        this.restoreAttributesRec(copy[attr], tableRestored);
                    } else if(copy.originalObj && !copy.originalObj[attr] && !copy.originalObj instanceof(Array)) {
                        //copy.originalObj[attr]=copy[attr].originalObj; //useless
                        this.restoreAttributesRec(copy[attr], tableRestored);
                     } else {
                        this.restoreAttributesRec(copy[attr], tableRestored);
                    }
                    
            } else if (typeof(copy.originalObj)!="undefined") {
                copy.originalObj[attr]=copy[attr];
            }
        }
        if (copy.originalObj && copy.originalObj.endRestore) {
                copy.originalObj.endRestore(copy);
        }
        return true;
    }

};


