document.getElementById("optionsLink").onclick = (function(){
  self.port.emit("showOptions");
});
