// TabPush main file
// @author Srijan Choudhary

exports.main = function(options) {
  /*
   * Variables and includes
   */
  var data = require("self").data;
  var pw = require("page-worker");
  var ss = require("simple-storage");
  var tabs = require("tabs");
  var optionsWorker=null;
  var optionsTab=null;

  var loggedIn = false;
  var username = "";

  /*
   * The background worker
   */
  var backgroundWorker = pw.Page({
    contentURL: data.url("background.html"),
      contentScriptFile: [
    data.url("dnode.js"),
      data.url("background.js")
    ],
      contentScriptWhen: "ready"
  });

  /*
   * Background worker events and message handling.
   */
  backgroundWorker.port.on("initiateStorageCheck", function() {
    if(
      ss.storage.login!=null &&
      ss.storage.login!="" &&
      ss.storage.password!=null &&
      ss.storage.password!=""
      ) {
        console.log("Calling server side login");
        backgroundWorker.port.emit("serverLogin",ss.storage.login,ss.storage.password);
      }
    else {
      showOptions(false);
    }
  });

  backgroundWorker.port.on("loginSucceeded", function(name) {
    loggedIn = true;
    username = name;
    if(optionsWorker) {
      optionsWorker.port.emit("loginSucceeded");
    }
    if(popup) {
      popup.port.emit("loginNotify");
    }
  });

  backgroundWorker.port.on("loginFailed", function() {
    loggedIn = false;
    showOptions(true);
  });

  backgroundWorker.port.on("sendTabStatus", function(s) {
    if(popup) {
      if(s) {
        popup.port.emit("sendSuccess");
      }
      else {
        popup.port.emit("sendError","Error sending tab");
      }
    }
  });

  backgroundWorker.port.on("addTab", function(tab) {
    //console.log(tab.url);
    if(popup) {
      popup.port.emit("addTab",tab);
    }
  });

  /*
   * The popup panel
   */
  var popup = require("panel").Panel({
    contentURL: data.url("popup.html"),
      contentScriptFile: data.url("popup.js")
  });

  /*
   * Popup events and message handling.
   */
  popup.on("show", function() {
    /*var tabs = require("tabs");
      console.log(tabs.activeTab.url);
      this.port.emit("setTabData",tabs.activeTab.url);*/
  });

  popup.port.on("showOptions", function() {
    showOptions(false);
    popup.hide();
  });

  popup.port.on("openTab", function(url) {
    tabs.open({
      url: url,
      inBackground: false
    });
  });

  popup.port.on("sendTab", function(dest) {
    if(loggedIn) {
      backgroundWorker.port.emit("sendTab", {"url":tabs.activeTab.url,"title":tabs.activeTab.title,"sender":username}, dest);
    }
    else {
      popup.port.emit("sendError","Not logged in");
    }
  });

  /*
   * The toolbar button
   */
  var tbb = require("toolbarbutton").ToolbarButton({
    id: "tabpush",
      label: "TabPush",
      image: data.url("icon.png"),
      panel: popup
  });
  tbb.moveTo({
    toolbarID: "nav-bar",
    forceMove: false // only move from palette
  });

  /*
   * Other functions
   */
  function showOptions(showError) {
    if(optionsTab) {
      // activate tab, and show message(s) if any.
      optionsTab.activate();
      if(showError) {
        optionsWorker.port.emit("authError");
      }
    }
    else {
      tabs.open({
        url: data.url("options.html"),
        inBackground: false,
        onReady: function(tab) {
          optionsTab = tab;
          optionsWorker = tab.attach({
            contentScriptFile: data.url("options.js")
          });
          if(ss.storage.login && ss.storage.login!="") {
            optionsWorker.port.emit("setValues",ss.storage.login,ss.storage.password);
          }
          optionsWorker.port.on("saveCreds", function(login,password) {
            ss.storage.login = login;
            ss.storage.password = password;
            console.log("Calling server side login");
            backgroundWorker.port.emit("serverLogin",ss.storage.login,ss.storage.password);
            //optionsWorker.tab.close();
          });
          optionsWorker.port.on("closeWindow", function() {
            console.log("closing options page");
            optionsWorker.tab.close();
          });
          if(showError) {
            optionsWorker.port.emit("authError");
          }
        },
        onClose: function() {
          optionsWorker = null;
          optionsTab = null;
        }
      });
    }
  }

};
