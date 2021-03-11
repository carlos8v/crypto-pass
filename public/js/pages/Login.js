import { getInfo, handleNotification } from '../utils.js';

const LoginForm = {
  state: {
    parent: '#form',
    username: '',
    password: '',
  },
  handleInput: function(name, value) {
    this.state[name] = value;
  },
  handleAlreadyLogIn: async function() {
    if (localStorage.getItem('token') !== null) {
      const { baseURL } = await getInfo();
      window.location.href = `${baseURL}/home`;
    }
  },
  handleSubmit: async function(e) {
    e.preventDefault();

    const { baseURL } = await getInfo();
    const { username, password } = this.state;

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
  },
  setupEvents() {
    document.querySelectorAll('.input-block > input').forEach(input => {
      input.addEventListener('input', ({ target }) => this.handleInput(input.id, target.value));
    });
    document.querySelector(this.state.parent)
      .addEventListener('submit', (e) => this.handleSubmit(e));
  },
  render() {
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
  },
  async update() {
    await this.handleAlreadyLogIn();
    document.querySelector(this.state.parent).innerHTML = this.render();
    this.setupEvents();
  }
}

async function updateDom() {
  await LoginForm.update();
}

window.onload = updateDom;
