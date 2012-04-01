var lib_ajax={
    get: function(url, func) {
        //console.log("lib_ajax : url="+url);
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, true);
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status==200) {
                func(xmlHttp.responseText);   // la fonction de prise en charge
            }
        }
        xmlHttp.send();
    }
};

