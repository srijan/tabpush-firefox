DNode.connect('localhost',8080,function (remote) {
  remote.ping(function(data){console.log(data);});

  // Do the following:
  // 1. Check for saved credentials in local storage.
  self.port.emit('initiateStorageCheck');
  // 2. Send credentials / open login page
});
