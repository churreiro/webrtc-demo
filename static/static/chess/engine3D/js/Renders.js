var Renders={
    misc: 0,
    chessman: 1,
    board:2,
    ground: 3,
    screen: 4,

    current: false,

    set: function(render) {
        if (this.current===render) return false;
        GL.uniform1i(SHADER_PROGRAM.render, render);
        this.current=render;
        return true;
    },

    reset: function() {
        this.current=false;
    }

};


