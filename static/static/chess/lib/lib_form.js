var lib_form = {
    prompt: function (valeur, defaultValue) {
        valeur = valeur || "Valeur: ";
        defaultValue = defaultValue|| "0";
        return prompt(valeur, defaultValue);
    },

    alert:function(msg) {
        alert(msg);
    },

    confirm: function(msg) {
        return confirm(msg);
    }
};

