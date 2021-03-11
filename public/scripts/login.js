import { getInfo, handleNotification } from './utils.js';

const LoginForm = {
  state: {
    parent: '#form',
    username: '',
    password: '',
  },
  handleInput(loginForm, name, value) {
    loginForm.state[name] = value;
  },
  async handleSubmit(formLogin, e) {
    e.preventDefault();
    
    const { baseURL } = await getInfo();

    try {
      const { data } = await axios.get(`${baseURL}/users/find`, {
        auth: {
          username: formLogin.state.username,
          password: formLogin.state.password,
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
      input.addEventListener('input', ({ target }) => this.handleInput(this, input.id, target.value));
    });
    document.querySelector(this.state.parent).addEventListener('submit', (e) => this.handleSubmit(this, e));
  },
  render() {
    return `
      <div class="input-block">
        <label for="name">Username:</label>
        <input type="text" id="username" placeholder="ada.lovelace@email.com">
      </div>
      <div class="input-block">
        <label for="password">Password:</label>
        <input type="password" id="password" placeholder="safe_password.hash()">
      </div>
      <button type="submit">Sign in</button>
    `;
  },
  update() {
    document.querySelector(this.state.parent).innerHTML = this.render();
    this.setupEvents();
  }
}

function updateDom() {
  LoginForm.update();
}

window.onload = updateDom;