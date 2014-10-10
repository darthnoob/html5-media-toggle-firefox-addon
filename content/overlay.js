/*******************************************************************************
toggle html5 media support

creation: 2010-03-09 00:00 - spenibus
  update: 2014-10-09 21:13 - spenibus
*******************************************************************************/




/******************************************************************************/
var spenibus_html5MediaToggle = {


   /****************************************************************** button */
   button: null,




   /************************************************************** prefs list */
   prefs : [
      'media.directshow.enabled', // 0:reference
      'media.windows-media-foundation.enabled',
      'media.ogg.enabled',
      'media.opus.enabled',
      'media.raw.enabled',
      'media.wave.enabled',
      'media.webaudio.enabled',
      'media.webm.enabled',
   ],




   /**************************************************************** observer */
   init : function() {

      // self
      var me = this;

      // get prefs service root branch
      this.ps = Components.classes["@mozilla.org/preferences-service;1"]
         .getService(Components.interfaces.nsIPrefService);

      // add observer
      this.ps.addObserver("", spenibus_html5MediaToggle, false);

      // get button element, try document first
      this.button = document.getElementById('spenibus_html5_media_toggle_button');

      // try toolbar palette if document yielded nothing
      if(this.button == null) {
         for(var i = 0; i < gNavToolbox.palette.childNodes.length; ++i) {
            if(gNavToolbox.palette.childNodes[i].id == 'spenibus_html5_media_toggle_button') {
               this.button = gNavToolbox.palette.childNodes[i];
            }
         }
      }

      // add command to button
      this.button.addEventListener("command", function(){
         me.toggle.call(me)
      }, false);

      // update button
      this.buttonUpdate();
   },




   /**************************************************************** observer */
   observe : function(subject, topic, data) {

      // reference pref has changed, update button
      if(topic == "nsPref:changed" && data == this.prefs[0]) {
         this.buttonUpdate();
      }
   },




   /********************************************************** button updater */
   buttonUpdate : function() {

      this.button.setAttribute(
         'data-enabled',
         this.ps.getBoolPref(this.prefs[0]) ? 'true' : 'false'
      );
   },




   /***************************************************************** toggler */
   toggle : function() {

      // get reversed reference value
      var enabled = !this.ps.getBoolPref(this.prefs[0]);

      // set all prefs
      for(var i=0; i<this.prefs.length; ++i) {
         this.ps.setBoolPref(this.prefs[i], enabled);
      }
   },


};




/*********************************************************************** init */
window.addEventListener("load", function(){
   var me = spenibus_html5MediaToggle;
   me.init.call(me);
}, false);