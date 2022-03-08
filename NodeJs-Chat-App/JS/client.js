const socket = io("http://localhost:8000");
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

var sentAudio = new Audio("sent.mp3");
var reciveAudio = new Audio("recive.mp3");

const append = (name, message, time, position) => {
  const messageElement = document.createElement("div");

  const username = document.createElement("span");
  username.innerHTML = name;
  const _time = document.createElement("span");
  _time.innerHTML = time;
  username.classList.add("user-name");
  _time.classList.add("time");
  messageElement.append(username);
  messageElement.append(message);
  messageElement.append(_time);
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    reciveAudio.play();
  } else if (position == "right") {
    sentAudio.play();
  }
};
const Name = prompt("Enter Your Name To Join");

if (Name == "") {
  alert("Unable To Join Please Enter a Valid Name");
} else {
  socket.emit("new-user-joined", Name);

  socket.on("user-joined", (name) => {
    var today = new Date();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    append(name, `joined the Chat`, time, "left");
  });
  socket.on("receive", (data) => {
    var today = new Date();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    append(data.name, `${data.message}`, time, "left");
  });
  socket.on("left", (Name) => {
    var today = new Date();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    append(Name, ` left the chat`, time, "left");
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    var today = new Date();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    append("You", `${message}`, time, "right");
    socket.emit("send", message);
    messageInput.value = "";
  });
}
