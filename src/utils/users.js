/* eslint-disable no-shadow */
/**
 *
 * @param {boolean} success
 * @param {string} error
 * @param {number} statusCode
 */
const handleError = (success = false, error = 'error', statusCode = 404) => ({
  success,
  error,
  statusCode,
});

const users = [];

/**
 *
 * @param {string} str
 */
const prettifyString = str => str.trim().toLowerCase();

/**
 *
 * @param {Object} userObject
 */
const addUser = userObject => {
  let { id, username, room } = userObject;
  username = prettifyString(username);
  room = prettifyString(room);

  if (!username || !room) {
    return handleError(false, 'Username and room is required', 400);
  }

  // find the right user
  const isUser = users.find(
    user => user.username === username && user.room === room
  );

  if (isUser) {
    return handleError(false, 'Username is in use', 400);
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

/**
 *
 * @param {string} userID
 */
const removeUser = userID => {
  const findUserIndx = users.findIndex(user => user.id === userID);
  if (findUserIndx !== -1) {
    return users.splice(findUserIndx, 1)[0];
  }
};

/**
 *
 * @param {string} userId
 */
const getUser = userId => {
  const findUser = users.find(user => user.id === userId);
  if (!findUser) {
    return handleError(false, `no user found with id of ${userId}`, 400);
  }
  return findUser;
};

/**
 *
 * @param {string} roomName
 */
const getUsersInRoom = roomName => {
  const isUsers = users.filter(user => user.room === roomName);
  if (isUsers.length === 0) {
    return handleError(false, `No users found in room ${roomName}`, 400);
  }
  return isUsers;
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
