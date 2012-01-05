DNode.connect('localhost',8080,function (remote) {
  remote.ping(function(data){console.log(data);});

  self.port.emit("initiateStorageCheck");
  self.port.on("serverLogin", function(login,password) {
    remote.auth(login,password, function(data) {
      console.log(data);
    });
  });
});
