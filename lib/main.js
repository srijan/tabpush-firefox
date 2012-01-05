// TabPush main file
// @author Srijan Choudhary

exports.main = function(options) {
    var data = require("self").data;
    var pw = require("page-worker");
    var ss = require("simple-storage");
    var tabs = require("tabs");

    var worker = pw.Page({
      contentURL: data.url("background.html"),
        contentScriptFile: [
          data.url("dnode.js"),
          data.url("background.js")
        ],
        contentScriptWhen: "ready"
    });

    worker.port.on("initiateStorageCheck", function() {
      if(
        ss.storage.login!=null &&
        ss.storage.login!="" &&
        ss.storage.password!=null &&
        ss.storage.password!=""
        ) {
          console.log("Calling server side login");
      }
      else {
        console.log("opening options page");
        tabs.open({
          url: data.url("options.html"),
          inBackground: false,
          onReady: function(tab) {
            optionsWorker = tab.attach({
              contentScriptFile: data.url("options.js")
            });
            optionsWorker.port.on("saveCreds", function(login,password) {
              ss.storage.login = login;
              ss.storage.password = password;
              console.log("Calling server side login");
              optionsWorker.tab.close();
            });
            optionsWorker.port.on("closeWindow", function() {
              console.log("closing options page");
              optionsWorker.tab.close();
            });
          }
        });
      }
    });

    var popup = require("panel").Panel({
      contentURL: data.url("popup.html"),
      contentScriptFile: data.url("popup.js")
    });
    /*
    popup.on("show", function() {
        var tabs = require("tabs");
        console.log(tabs.activeTab.url);
        this.port.emit("setTabData",tabs.activeTab.url);
    });
    */

    // create toolbarbutton
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
};
