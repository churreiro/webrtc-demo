/*
 *
 *
 *
 */
var SKYDOMEOBJ;
var SkydomeObj=function(spec) {

    
    spec.current_hour=parseInt(lib_dom.getValue("sun_hour"))+Engine3D.params.hour_offset;
    spec.current_month=7;//july
    spec.current_latitude=lib_maths.degToRad(lib_dom.getValue("sun_latitude"));
    spec.current_monthSelected=lib_dom.get("sun_month0");

    spec.mesh=Skydome({bands: 10,
                       R: 50,
                       rings: 15,
                       phi0: Math.PI
                       });

    spec.texture=Texture({imageURL: "engine3D/ressources/skydomes/4.jpg"})

    var that=Obj({
        mesh: spec.mesh,
        render: Renders.sky,
        texture: spec.texture
    });

    that.set_month=function(m, dom_elt) {
        if (spec.current_monthSelected) spec.current_monthSelected.className="month";
        dom_elt.className='month monthSelected';
        spec.current_monthSelected=dom_elt;
        spec.current_month=m;
        that.refresh();
    },

    that.set_hour=function() {
        var h=Engine3D.params.hour_offset+parseInt(lib_dom.getValue("sun_hour"));
        if (h==spec.current_hour) return false;
        spec.current_hour=h;
        that.refresh();
        return true;
    }

    that.set_latitude=function() {
        var lat=lib_maths.degToRad(lib_dom.getValue("sun_latitude"));
        if (lat==spec.current_latitude) return false;
        spec.current_latitude=lat
        that.refresh();
        return true;
    }

    that.refresh=function() {
        var params=that.refreshPos();
        LIGHTMAP.refresh_sun(params);
    }

    that.refreshPos=function() {
        var params=that.get_params();
        that.resetPos();
        that.rotateY(params.phi);
        that.rotateZ(-Math.PI/2+params.theta);
        return params;
    }

    that.get_params=function() {        
        var params=lib_calendar.get_sunAngles2(spec.current_month, spec.current_hour, spec.current_latitude);
        return {theta: -params.azimuth, phi: params.zenith};
    }

    that.dispatch=function() {
        SCENE.addObjEnd(that);
    }
    that.type="skydomeObj";

    that.refreshPos();
    SKYDOMEOBJ=that;
};

