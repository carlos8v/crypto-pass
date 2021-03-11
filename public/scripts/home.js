import {
  getInfo,
  handleNotification
} from './utils.js';

const User = {
  state: {
    parent: '.user-container',
    username: '',
    passwords: 0,
  },
  async fetchUser() {
    const { baseURL } = await getInfo();
    
    if (!localStorage.getItem('token'))
      window.location.href = baseURL;

    try {
      const { data: user } = await axios.get(`${baseURL}/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      const { data: pass } = await axios.get(`${baseURL}/passwords`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      this.state.username = user.username;
      this.state.passwords = pass.length;
    } catch ({ response }) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = baseURL;
      }
    }
  },
  async handleLogout() {
    localStorage.removeItem('token');
  
    const { baseURL } = await getInfo();
    window.location.href = baseURL;
  },
  setupEvents() {
    document.querySelector('.log-out').addEventListener('click', this.handleLogout);
  },
  render() {
    return `
      <div class="section-header">
        <p class="title">User</p>
      </div>
      <div class="user-content">
        <p class="username">${this.state.username}</p>
        <i class="fas fa-key">
          <span class="passwords-count">${this.state.passwords}</span>
        </i>
      </div>
      <button class="log-out">Log out</button>
    `;
  },
  async update() {
    await this.fetchUser();
    document.querySelector(this.state.parent).innerHTML = this.render();
    this.setupEvents();
  }
};

const PasswordContainer = {
  state: {
    parent: '.home-container',
    passwords: [],
  },
  async fetchPasswords() {
    this.state.passwords = [];
    const { baseURL } = await getInfo();

    const { data } = await axios.get(`${baseURL}/passwords`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });

    if (data.length !== 0) {
      data.forEach((pass) => {
        this.state.passwords.push(Password.generate(pass));
      });
    }
  },
  renderPasswords() {
    let passwordsList = '';
    this.state.passwords.forEach(pass => {
      passwordsList += pass.render();
    });
    return passwordsList;
  },
  initializePasswordsEvents() {
    this.state.passwords.forEach(pass => {
      pass.setupEvents();
    });
  },
  render() {
    return `
      <div class="section-header">
        <p class="title">Your Passwords</p>
        <button class="new-password">New</button>
      </div>
      <div class="passwords-container">${this.renderPasswords()}</div>
      <div class="no-passwords-saved">You don't have any saved passwords yet</div>
    `;
  },
  async update() {
    await this.fetchPasswords();
    document.querySelector(this.state.parent).innerHTML = this.render();
    this.initializePasswordsEvents();
    if (this.state.passwords.length === 0 ) {
      document.querySelector('.no-passwords-saved').classList.add('no-passwords-saved-enabled');
    }
  }
}

const Password = {
  state: {
    parent: '.passwords-container',
    service: '',
    password: '',
    password_id: 0,
  },
  handleCopy({ state }) {
    navigator.clipboard.writeText(state.password);
    handleNotification('.copy', 'Password copied to clipboard');
  },
  handleDelete({ state }) {
    DeleteBox.initializeState(state);
  },
  toggleVisibility(pass) {
    document.querySelector(`#visibility-${pass.state.password_id}`)
      .classList.toggle('password-visibility-enabled');

    document.querySelector(`#pass-${pass.state.password_id}`)
      .classList.toggle('password-enabled');
  },
  setupEvents() {
    document.querySelector(`#copy-${this.state.password_id}`)
      .addEventListener('click', () => this.handleCopy(this));

    document.querySelector(`#delete-${this.state.password_id}`)
      .addEventListener('click', () => this.handleDelete(this));

    document.querySelector(`#visibility-${this.state.password_id}`)
      .addEventListener('click', () => this.toggleVisibility(this));
  },
  render() {
    return `
      <div class="password-container">
        <div class="password-info">
          <i class="fas fa-cog"></i> <p>${this.state.service}</p>
        </div>
        <div id="pass-${this.state.password_id}" class="password-info password">
          <i class="fas fa-key"></i> <p>${this.state.password}</p>
        </div>
        <div class="actions-container">
          <button id="copy-${this.state.password_id}">copy</button>
          <button id="delete-${this.state.password_id}">delete</button>
        </div>
        <p id="visibility-${this.state.password_id}" class="password-visibility"></p>
      </div>
    `;
  },
  generate(passInfo) {
    const newPass = new Object({
      ...this,
      state: {
        ...passInfo,
      }
    });
    return newPass;
  }
};

const DeleteBox = {
  state: {
    parent: '#delete-box',
    password_id: 0,
    service: '',
    input: '',
  },
  initializeState(state) {
    this.state.service = state.service;
    this.state.password_id = state.password_id;
    this.state.input = '';
    document.querySelector('#delete-input').value = '';
    
    this.update();
    
    this.toggleBoxEnable();
  },
  handleInput(deleteBox, value) {
    deleteBox.state.input = value;
    const deleteButton = document.querySelector('#delete-btn');
    if (value === `${User.state.username}/${deleteBox.state.service}`) {
      deleteButton.removeAttribute('disabled');
    } else {
      if (!deleteButton.hasAttribute('disabled')) {
        deleteButton.setAttribute('disabled', '');
      }
    }
  },
  async handleDelete(deleteBox) {
    const { baseURL } = await getInfo();

    try {
      await axios.delete(`${baseURL}/passwords/${deleteBox.state.password_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      deleteBox.toggleBoxEnable();
      PasswordContainer.update();
      User.update();

    } catch ({ response }) {
      if (response.status === 401) {
        alert('User was not authorized');
        localStorage.removeItem('token');
        window.location.href = baseURL;
      }
    }
  },
  toggleBoxEnable() {
    const contrast = document.querySelector('.contrast');
    contrast.classList.toggle('contrast-active');
    document.querySelector('#delete-box').classList.toggle('box-active');
  },
  setupEvents() {
    document.querySelector('#delete-close')
      .addEventListener('click', () => this.toggleBoxEnable());
    document.querySelector('#delete-input')
      .addEventListener('input', ({ target }) => this.handleInput(this, target.value));
    document.querySelector('#delete-btn')
      .addEventListener('click', () => this.handleDelete(this));
  },
  render() {
    return `
      <header class="box-header">
        <p>Are you sure?</p>
        <button class="box-header-btn" id="delete-close">
          <i class="fas fa-times"></i>
        </button>
      </header>
      <div class="warn">You won't be able to recover this password</div>
      <main class="box-content">
        <p>Please type <strong class="pass-name">${User.state.username}/${this.state.service}</strong> to confirm.</p>
        <input type="text" class="box-input delete-input" id="delete-input">
        <button id="delete-btn" class="box-btn delete-btn" disabled>I understand the consequences, delete this password</button>
      </main>
    `;
  },
  update() {
    document.querySelector(this.state.parent).innerHTML = this.render();
    this.setupEvents();
  }
}

async function updateDom() {
  User.update();
  PasswordContainer.update();
  DeleteBox.update();
}

window.onload = updateDom;
