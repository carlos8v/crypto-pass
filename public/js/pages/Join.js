import { getInfo, handleNotification } from '../utils.js';

function createSignUpForm(parent) {
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

    try {
      const { data } = await axios.post(`${baseURL}/users/new`, { username });

      localStorage.setItem('token', data.token);
      window.location.href = `${baseURL}/home`;
    } catch(err) {
      handleNotification('.error', 'Username has already been chosen');
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
        <input id="username" type="text" placeholder="ada.love312" required>
      </div>
      <div class="input-block">
        <label for="email">Email:
          <span>Your password will be sent to this email.</span>
        </label>
        <input id="email" type="text" placeholder="ada.lovelace@email.com" required>
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

window.onload = async () => {
  await createSignUpForm('#sign-up-form')();
};