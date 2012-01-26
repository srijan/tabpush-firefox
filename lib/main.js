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
          worker.port.emit("serverLogin",ss.storage.login,ss.storage.password);
      }
      else {
        showOptions(false);
      }
    });

    worker.port.on("loginFailed", function() {
      showOptions(true);
    });

    function showOptions(showError) {
      console.log("opening options page");
      tabs.open({
        url: data.url("options.html"),
        inBackground: false,
        onReady: function(tab) {
          optionsWorker = tab.attach({
            contentScriptFile: data.url("options.js")
          });
          if(ss.storage.login!="") {
            optionsWorker.port.emit("setValues",ss.storage.login,ss.storage.password);
          }
          optionsWorker.port.on("saveCreds", function(login,password) {
            ss.storage.login = login;
            ss.storage.password = password;
            console.log("Calling server side login");
            worker.port.emit("serverLogin",ss.storage.login,ss.storage.password);
            optionsWorker.tab.close();
          });
          optionsWorker.port.on("closeWindow", function() {
            console.log("closing options page");
            optionsWorker.tab.close();
          });
          if(showError) {
            optionsWorker.port.emit("authError");
          }
        }
      });
    }

    var popup = require("panel").Panel({
      contentURL: data.url("popup.html"),
      contentScriptFile: data.url("popup.js")
    });

    popup.on("show", function() {
      worker.port.emit("checkLogin");
        /*var tabs = require("tabs");
        console.log(tabs.activeTab.url);
        this.port.emit("setTabData",tabs.activeTab.url);*/
    });


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
