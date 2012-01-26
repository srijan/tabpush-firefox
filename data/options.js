document.getElementById("saveButton").onclick = (function() {
  var messageText = document.getElementById("messageText");
  messageText.style.display = 'none';
  document.getElementById("saveButton").style.display = 'none';
  document.getElementById("loaderIcon").style.display = 'inline';
  self.port.emit("saveCreds",document.getElementById("loginInput").value,document.getElementById("passwordInput").value);
});

document.getElementById("cancelButton").onclick = (function() {
  self.port.emit("closeWindow");
});

self.port.on("loginSucceeded", function() {
  var messageText = document.getElementById("messageText");
  document.getElementById("saveButton").style.display = 'inline';
  document.getElementById("loaderIcon").style.display = 'none';
  messageText.innerHTML = "Login Successful";
  messageText.style.color = 'green';
  messageText.style.display = 'block';
});

self.port.on("authError", function() {
  var messageText = document.getElementById("messageText");
  messageText.innerHTML = "Authentication Error";
  messageText.style.color = 'red';
  messageText.style.display = 'block';
  document.getElementById("saveButton").style.display = 'inline';
  document.getElementById("loaderIcon").style.display = 'none';
});

self.port.on("setValues", function(login,password) {
  document.getElementById("loginInput").value = login;
  document.getElementById("passwordInput").value = password;
});
