import { getInfo, handleNotification } from '../utils.js';

function createSignUpForm(parent, document) {
  const state = {
    parent,
    username: '',
    email: '',
  }

  function handleInput(name, value) {
    state[name] = value;
  }

  async function handleAlreadyLogIn() {
    if (localStorage.getItem('token') !== null) {
      const { baseURL } = await getInfo();
      window.location.href = `${baseURL}/home`;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { baseURL } = await getInfo();
    const { username, email } = state;

    if (!/\w+@+\w+.com/.test(email)) {
      handleNotification('error', 'Provided email is malformed');
      return;
    }

    const submitButton = document.querySelector('#sign-up-form > button');
    submitButton.setAttribute('disabled', '');

    try {
      const { data } = await axios.post(`${baseURL}/users/new`, { username, email });

      localStorage.setItem('token', data.token);
      window.location.href = `${baseURL}/home`;
    } catch({ response: { data }}) {
      const { error: { code } } = data;
      let msg = 'An internal error has occurred'
      switch(code) {
        case 'SQLITE_CONSTRAINT':
          msg = 'Username has already been chosen';
          break;
        case 'ESOCKET':
          msg = 'You have a SSL error in your SMTP config';
          break;
        case 'EAUTH':
          msg = 'You have an authentication problem in your SMTP config';
          break;
      }

      handleNotification('error', msg);
      submitButton.removeAttribute('disabled');
    }
  }

  function setupEvents() {
    document.querySelectorAll('.input-block > input').forEach(input => {
      input.addEventListener('input', ({ target }) => handleInput(input.id, target.value));
    });

    document.querySelector(state.parent).addEventListener('submit', (e) => handleSubmit(e));
  }

  function render() {
    return `
      <div class="input-block">
        <label for="username">Username:
          <span>Your username must be unique.</span>
        </label>
        <input id="username" type="text" placeholder="ada.love312" autocomplete="off" required>
      </div>
      <div class="input-block">
        <label for="email">Email:
          <span>Your password will be sent to this email.<br>Do not write it wrong!</span>
        </label>
        <input id="email" type="email" placeholder="ada.lovelace@email.com" autocomplete="off" required>
      </div>
      <button type="submit">Sign Up</button>
    `;
  }

  async function update() {
    await handleAlreadyLogIn();
    document.querySelector(state.parent).innerHTML = render();
    setupEvents();
  }

  return update;
}

(async () => {
  await createSignUpForm('#sign-up-form', document)();
})();
