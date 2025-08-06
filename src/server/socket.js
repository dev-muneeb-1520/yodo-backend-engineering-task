const users = require('./utils/users');

const socketIO = (io) => {
    io.on('connection', (socket) => {
        console.log('New user connected');

        socket.on('join', (userId) => {
            users.addUser({ id: socket.id, userId });
            io.emit('userList', users.getUsers());
        });

        socket.on('message', (data) => {
            const { userId, message } = data;
            const recipientSocket = users.getUserSocket(userId);
            if (recipientSocket) {
                io.to(recipientSocket).emit('message', { userId, message });
            } else {
                socket.emit('message', { userId: 'System', message: 'User not found' });
            }
        });

        socket.on('groupMessage', (data) => {
            const { userId, message } = data;
            io.emit('message', { userId, message });
        });

        socket.on('adminBroadcast', (data) => {
            const { adminId, message } = data;
            if (users.isAdmin(adminId)) {
                io.emit('message', { userId: 'Admin', message });
            } else {
                socket.emit('message', { userId: 'System', message: 'You are not authorized to broadcast messages' });
            }
        });

        socket.on('disconnect', () => {
            users.removeUser(socket.id);
            io.emit('userList', users.getUsers());
            console.log('User disconnected');
        });
    });
};

module.exports = socketIO;
