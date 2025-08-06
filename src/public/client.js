const socket = io();
const userId = prompt("Enter your user ID:");
const isAdmin = confirm("Are you an admin?");

socket.emit("join", { userId, isAdmin });

const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const messagesList = document.getElementById("messages");
const usersList = document.getElementById("users");

sendButton.addEventListener("click", () => {
    const message = messageInput.value;
    const recipientId = prompt("Enter recipient ID for one-to-one message (leave blank for group message):");
    
    if (recipientId) {
        socket.emit("privateMessage", { userId, recipientId, message });
    } else {
        socket.emit("groupMessage", { userId, message });
    }
    
    messageInput.value = '';
});

socket.on("message", (data) => {
    const messageItem = document.createElement("li");
    messageItem.textContent = `${data.userId}: ${data.message}`;
    messagesList.appendChild(messageItem);
});

socket.on("userList", (users) => {
    usersList.innerHTML = '';
    users.forEach(user => {
        const userItem = document.createElement("li");
        userItem.textContent = user.name;
        usersList.appendChild(userItem);
    });
});

socket.on("broadcast", (data) => {
    const messageItem = document.createElement("li");
    messageItem.textContent = `Admin: ${data.message}`;
    messagesList.appendChild(messageItem);
});