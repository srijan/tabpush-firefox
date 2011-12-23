// TabPush main file
// @author Srijan Choudhary

exports.main = function(options) {
    var data = require("self").data;
    
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
