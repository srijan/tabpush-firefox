var sendingStatusText = document.getElementById("sendingStatusText");
var destinationInput = document.getElementById("destinationInput");

document.getElementById("optionsLink").onclick = (function(){
  self.port.emit("showOptions");
});

document.getElementById("sendButton").onclick = (function() {
  sendingStatusText.style.display = "none";
  self.port.emit("sendTab",destinationInput.value);
});

self.port.on("addTab", function(tab) {
  var item = document.createElement("li");
  item.innerHTML = "<a href=\""+tab.url+"\" onclick=\"return false;\">"+tab.title+"</a> -- "+tab.sender;
  document.getElementById("inboxList").appendChild(item);
  item.onclick = function() {
    self.port.emit("openTab",tab.url);
  }
});

self.port.on("sendError", function(msg) {
  sendingStatusText.style.display = "block";
  sendingStatusText.style.color = "red";
  sendingStatusText.innerHTML = msg;
});

self.port.on("sendSuccess", function() {
  sendingStatusText.style.display = "block";
  sendingStatusText.style.color = "green";
  sendingStatusText.innerHTML = "Send Successful";
  destinationInput.value = "";
});

self.port.on("loginNotify", function() {
  sendingStatusText.style.display = "none";
});
