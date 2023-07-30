const chatForm = document.getElementById("chat-form");
const chatMesssages = document.querySelector(".chat-messages");


const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log(username)

const socket = io();

socket.emit("joinRoom", {username})



socket.on("message", (message) => {
  // console.log(message);
  outputMessage(message);

  chatMesssages.scrollTop = chatMesssages.scrollHeight;
  //
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let msg = e.target.elements.msg.value;
  // const message0 = new Chat({
  //   name: customList,
  //   message: msg,
  // });
  socket.emit("chatMessage", msg);

  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus;
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `	
  <p class="meta">${message.username}<span> ${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}


