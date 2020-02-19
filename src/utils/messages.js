/**
 *
 * @param {string} text

 */
const generateMessage = text => ({
  text,

  createdAt: new Date().getTime(),
});

/**
 *
 * @param {string} url
 */
const generateLocationMessage = url => ({
  url,
  createdAt: new Date().getTime(),
});

module.exports = {
  generateMessage,
  generateLocationMessage,
};
