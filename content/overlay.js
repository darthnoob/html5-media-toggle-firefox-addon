//*********** export named single global object while using shorthand internally
var spenibus_html5MediaToggle = (function() {




    //************************************************************** run on load
    window.addEventListener('load', (function f(){

        // remove init listener
        window.removeEventListener('load', f, false);

        s.init();

    }), false);




    //******************************************************* internal shorthand
    var s = {};




    //****************************************************************** buttons
    s.button_id_support  = 'spenibus_html5_media_toggle_button_support';
    s.button_id_autoplay = 'spenibus_html5_media_toggle_button_autoplay';
    s.button_support     = null;
    s.button_autoplay    = null;




    //******************************************************************** prefs
    prefs_autoplay = 'media.autoplay.enabled';
    prefs_support  = [
        'media.directshow.enabled', // 0:reference
        'media.fragmented-mp4.enabled',
        'media.mp4.enabled',
        'media.ogg.enabled',
        'media.opus.enabled',
        'media.raw.enabled',
        'media.wave.enabled',
        'media.webaudio.enabled',
        'media.webm.enabled',
        'media.webvtt.enabled',
        'media.windows-media-foundation.enabled',
        'media.wmf.enabled',
    ];




    //************************************************************ prefs service
    s.ps = null;




    //************************************************************ init/observer
    s.init = function() {

        // get prefs service root branch
        s.ps = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService);

        // add observer
        s.ps.addObserver('', s, false);


        // get buttons element, try document first
        s.button_support  = s.buttonGet(s.button_id_support);
        s.button_autoplay = s.buttonGet(s.button_id_autoplay);


        // add command to button: support
        s.button_support.addEventListener("command", function(){
            s.toggleSupport();
        }, false);


        // add command to button: autoplay
        s.button_autoplay.addEventListener("command", function(){
            s.toggleAutoplay();
        }, false);


        // update button
        s.buttonUpdate();
    };




    //***************************************************************** observer
    s.observe = function(subject, topic, data) {

        var t = topic == "nsPref:changed";
        var d = data == s.prefs_support[0] || data == s.prefs_autoplay;

        // reference pref has changed, update button
        if(t && d) {
            s.buttonUpdate();
        }
    };




    //************************************************************ button getter
    s.buttonGet = function(id) {

        // try document first
        var b = document.getElementById(id);

        // try toolbar palette if document yielded nothing
        if(b == null) {
            b = gNavToolbox.palette.querySelector('#'+id);
        }

        return b;
    };




    //*********************************************************** button updater
    s.buttonUpdate = function() {

        // support
        s.button_support.setAttribute(
            'data-enabled',
            s.ps.getBoolPref(s.prefs_support[0]) ? 'true' : 'false'
        );

        // autoplay
        s.button_autoplay.setAttribute(
            'data-enabled',
            s.ps.getBoolPref(s.prefs_autoplay) ? 'true' : 'false'
        );
    };




    //********************************************************** support toggler
    s.toggleSupport = function() {

        // get reversed reference value
        var enabled = !s.ps.getBoolPref(s.prefs_support[0]);

        // set all prefs
        for(var i=0; i<s.prefs_support.length; ++i) {
            s.ps.setBoolPref(s.prefs_support[i], enabled);
        }
    };




    //********************************************************* autoplay toggler
    s.toggleAutoplay = function() {

        // set reverse pref
        s.ps.setBoolPref(s.prefs_autoplay, !s.ps.getBoolPref(s.prefs_autoplay));
    };




    //******************************************************************* export
    return s;


})();