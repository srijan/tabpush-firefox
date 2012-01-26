document.getElementById("saveButton").onclick = (function() {
  self.port.emit("saveCreds",document.getElementById("loginInput").value,document.getElementById("passwordInput").value);
});
document.getElementById("cancelButton").onclick = (function() {
  self.port.emit("closeWindow");
});
self.port.on("setValues", function(login,password) {
  document.getElementById("loginInput").value = login;
  document.getElementById("passwordInput").value = password;
});
self.port.on("authError", function() {
  var errorText = document.getElementById("errorText");
  errorText.innerHTML = "Authentication Error";
  errorText.style.display = 'block';
});
