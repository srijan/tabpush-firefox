var session=null;
DNode.connect('www.tabpush.com',443,{ secure : true },function (remote) {
  remote.ping(function(data){console.log(data);});

  self.port.emit("initiateStorageCheck");
  self.port.on("serverLogin", function(login,password) {
    remote.userLogin(login,password, function(s) {
      if(s) {
        self.port.emit("loginSucceeded");
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
});
