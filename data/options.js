document.getElementById("saveButton").onclick = (function() {
  self.port.emit("saveCreds",document.getElementById("loginInput").value,document.getElementById("passwordInput").value);
});
document.getElementById("cancelButton").onclick = (function() {
  self.port.emit("closeWindow");
});
