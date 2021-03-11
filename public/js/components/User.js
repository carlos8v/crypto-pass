import Context from '../context/Context.js';

const User = {
  state: {
    parent: '.user-container',
  },
  handleLogout: async function() {
    localStorage.removeItem('token');
  
    window.location.href = Context.state.baseURL;
  },
  setupEvents() {
    document.querySelector('#log-out').addEventListener('click', this.handleLogout);
  },
  render() {
    const { username, passwordsCount } = Context.state;

    return `
      <div class="section-header">
        <p class="title">User</p>
      </div>
      <div class="user-content">
        <p class="username">${username}</p>
        <i class="fas fa-key">
          <span class="passwords-count">${passwordsCount}</span>
        </i>
      </div>
      <button id="log-out" class="log-out">Log out</button>
    `;
  },
  update() {
    document.querySelector(this.state.parent).innerHTML = this.render();
    this.setupEvents();
  }
};

export default User;
