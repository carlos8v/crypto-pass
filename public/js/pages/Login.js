import { getInfo, handleNotification } from '../utils.js';

function createLoginForm(parent) {
  const state = {
    username: '',
    password: '',
    parent,
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
    const { username, password } = state;

    try {
      const { data } = await axios.get(`${baseURL}/users/find`, {
        auth: {
          username,
          password,
        },
      })
      
      localStorage.setItem('token', data.token);
      window.location.href = `${baseURL}/home`;
    } catch(err) {
      handleNotification('.error', 'Username or password does not match');
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
        <label for="name">Username:</label>
        <input type="text" id="username" placeholder="ada.lovelace@email.com" required>
      </div>
      <div class="input-block">
        <label for="password">Password:</label>
        <input type="password" id="password" placeholder="safe_password.hash()" required>
      </div>
      <button type="submit">Sign in</button>
    `;
  }
  
  async function update() {
    await handleAlreadyLogIn();
    document.querySelector(state.parent).innerHTML = render();
    setupEvents();
  }

  return {
    update,
  };
}

window.onload = async () => {
  await createLoginForm('#form').update();
}
