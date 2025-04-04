const socket = io();

const clientTotal = document.getElementById("client-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (nameInput.value) {
    sendMessage();
  } else {
    alert("masukan pesan terlebih dahulu");
  }
});

const sendMessage = () => {
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    datTime: new Date(),
  };

  socket.emit("message", data);
  addMessageToContainer(true, data);
  messageInput.value = "";
  scrollToBottom();
};

socket.on("chat-message", (data) => {
  addMessageToContainer(false, data);
  scrollToBottom();
});

const addMessageToContainer = (isOwnMessage, data) => {
  const element = ` <li class="${isOwnMessage ? "message-right" : "message-left"}">
                <p class="message">${data.message}
                    <span>${data.name} ▪ ${moment(data.datTime).fromNow()}</span>
                </p>
            </li>`;

  messageContainer.innerHTML += element;
};

const scrollToBottom = () => {
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

socket.on("client-total", (data) => {
  clientTotal.textContent = `Total Client ${data}`;
});
