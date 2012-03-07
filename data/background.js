var session=null;
DNode({
  /*
   * DNode Functions exposed to server
   */
  pushTab: function(tab) {
    self.port.emit("addTab",tab);
  }
}).connect('www.tabpush.com',443,{ secure : true },function (remote) {
  /*
   * Listening for stuff from main.js
   */
  self.port.on("serverLogin", function(login,password) {
    remote.userLogin(login,password, function(s) {
      if(s) {
        self.port.emit("loginSucceeded",login);
        session = s;
      }
      else {
        self.port.emit("loginFailed");
      }
    });
  });
  self.port.on("checkLogin", function() {
    if(session!=null) {
      session.checkLogin(function(res) {
        console.log("checkLogin: " + res);
      });
    }
    else {
      console.log("checkLogin: false");
    }
  });
  self.port.on("sendTab", function(tab,dest) {
    if(session) {
      session.pushTab(tab, dest, function(res) {
        self.port.emit("sendTabStatus", res);
      });
    }
  });

  /*
   * Init actions
   */
  remote.ping(function(data){console.log(data);});
  self.port.emit("initiateStorageCheck");
});
