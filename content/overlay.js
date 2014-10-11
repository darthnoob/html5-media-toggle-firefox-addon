/******************************************************************************/
var spenibus_html5MediaToggle = {


   /***************************************************************** buttons */
   button_id_support:  'spenibus_html5_media_toggle_button_support',
   button_id_autoplay: 'spenibus_html5_media_toggle_button_autoplay',
   button_support:  null,
   button_autoplay: null,




   /******************************************************************* prefs */
   prefs_autoplay : 'media.autoplay.enabled',
   prefs_support : [
      'media.directshow.enabled', // 0:reference
      'media.windows-media-foundation.enabled',
      'media.ogg.enabled',
      'media.opus.enabled',
      'media.raw.enabled',
      'media.wave.enabled',
      'media.webaudio.enabled',
      'media.webm.enabled',
   ],




   /*********************************************************** prefs service */
   ps : null,




   /**************************************************************** observer */
   init : function() {

      // self reference for out of context calls
      var me = this;

      // get prefs service root branch
      this.ps = Components.classes["@mozilla.org/preferences-service;1"]
         .getService(Components.interfaces.nsIPrefService);

      // add observer
      this.ps.addObserver('', spenibus_html5MediaToggle, false);

      // get buttons element, try document first
      this.button_support  = this.buttonGet(this.button_id_support);
      this.button_autoplay = this.buttonGet(this.button_id_autoplay);

      // add command to button: support
      this.button_support.addEventListener("command", function(){
         me.toggleSupport.call(me);
      }, false);

      // add command to button: autoplay
      this.button_autoplay.addEventListener("command", function(){
         me.toggleAutoplay.call(me);
      }, false);

      // update button
      this.buttonUpdate();
   },




   /**************************************************************** observer */
   observe : function(subject, topic, data) {

      var t = topic == "nsPref:changed";
      var d = data == this.prefs_support[0] || data == this.prefs_autoplay;

      // reference pref has changed, update button
      if(t && d) {
         this.buttonUpdate();
      }
   },




   /*********************************************************** button getter */
   buttonGet : function(id) {

      // try document first
      var b = document.getElementById(id);

      // try toolbar palette if document yielded nothing
      if(b == null) {
         for(var i=0; i<gNavToolbox.palette.childNodes.length; ++i) {
            if(gNavToolbox.palette.childNodes[i].id == id) {
               b = gNavToolbox.palette.childNodes[i];
            }
         }
      }

      return b;
   },




   /********************************************************** button updater */
   buttonUpdate : function() {

      // support
      this.button_support.setAttribute(
         'data-enabled',
         this.ps.getBoolPref(this.prefs_support[0]) ? 'true' : 'false'
      );

      // autoplay
      this.button_autoplay.setAttribute(
         'data-enabled',
         this.ps.getBoolPref(this.prefs_autoplay) ? 'true' : 'false'
      );
   },




   /********************************************************* support toggler */
   toggleSupport : function() {

      // get reversed reference value
      var enabled = !this.ps.getBoolPref(this.prefs_support[0]);

      // set all prefs
      for(var i=0; i<this.prefs_support.length; ++i) {
         this.ps.setBoolPref(this.prefs_support[i], enabled);
      }
   },




   /******************************************************** autoplay toggler */
   toggleAutoplay : function() {

      // set reverse pref
      this.ps.setBoolPref(this.prefs_autoplay, !this.ps.getBoolPref(this.prefs_autoplay));
   },

};




/*********************************************************************** init */
window.addEventListener("load", function(){
   spenibus_html5MediaToggle.init.call(spenibus_html5MediaToggle);
}, false);