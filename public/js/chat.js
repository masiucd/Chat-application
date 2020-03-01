/* eslint-disable no-undef */
const socket = io();

// Elements
// @ts-ignore
const messageForm = document.querySelector('#message-form');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');
// @ts-ignore
const sendLocationButton = document.querySelector('#send-location');
// @ts-ignore
const messages = document.querySelector('#messages');

// Templates
// @ts-ignore
const messageTemplate = document.querySelector('#message-template').innerHTML;
// @ts-ignore
const locationMessageTemplate = document.querySelector(
  '#location-message-template'
).innerHTML;

// @ts-ignore
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
// @ts-ignore
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  const newMessage = messages.lastElementChild;

  // get height of last message
  const newMsgStyles = getComputedStyle(newMessage);
  const newMessageMargin = Number(newMsgStyles.marginBottom);
  const newMsgHeight = newMessage.offsetHeight;
};

socket.on('message', message => {
  console.log(message);
  // @ts-ignore
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    // @ts-ignore
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', message => {
  console.log(message);
  // @ts-ignore
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    // @ts-ignore
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  messages.insertAdjacentHTML('beforeend', html);
});

socket.on('roomData', ({ room, users }) => {
  // @ts-ignore
  const html = Mustache.render(sideBarTemplate, {
    room,
    users,
  });
  // @ts-ignore
  document.getElementById('sidebar').innerHTML = html;
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();

  messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, error => {
    messageFormButton.removeAttribute('disabled');
    messageFormInput.value = '';
    messageFormInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log('Message delivered!');
  });
});

sendLocationButton.addEventListener('click', () => {
  // @ts-ignore
  if (!navigator.geolocation) {
    // @ts-ignore
    return alert('Geolocation is not supported by your browser.');
  }

  sendLocationButton.setAttribute('disabled', 'disabled');

  // @ts-ignore
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        sendLocationButton.removeAttribute('disabled');
        console.log('Location shared!');
      }
    );
  });
});

socket.emit('join', { username, room }, error => {
  if (error) {
    // @ts-ignore
    alert(error);
    location.href = '/';
  }
});
