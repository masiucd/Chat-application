/**
 *
 * @param {string[]} arr
 */
const randomWord = arr => arr[Math.floor(Math.random() * arr.length)];

const greetings = [
  'Welcome',
  'Dzien dobry',
  'God dag ',
  'privet',
  'Moshimoshi',
];

console.log(randomWord(greetings));

module.exports = {
  randomWord,
  greetings,
};
