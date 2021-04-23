import { redirectToLogin } from '../utils.js';

export default function createUser(parent, context, document) {
  const state = {
    parent,
  };

  async function handleLogout() {
    const { baseURL } = context.getState();
    redirectToLogin(baseURL);
  }

  function setupEvents() {
    document.querySelector('#log-out').addEventListener('click', handleLogout);
  }

  function render() {
    const { username, passwordsCount } = context.getState();

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
  }

  function update() {
    document.querySelector(state.parent).innerHTML = render();
    setupEvents();
  }

  return {
    update,
  }
}
