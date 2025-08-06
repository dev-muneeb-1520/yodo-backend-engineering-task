const users = [];

// Add a user to the chat
const addUser = ({ id, userId }) => {
    const existingUser = users.find(user => user.userId === userId);

    if (existingUser) {
        return { error: 'User already exists!' };
    }

    const user = { id, userId };
    users.push(user);
    return { user };
};

// Remove a user from the chat
const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

// Get a user by ID
const getUser = (id) => {
    return users.find(user => user.id === id);
};

// Get all users in the chat
const getUsersInRoom = () => {
    return users;
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };