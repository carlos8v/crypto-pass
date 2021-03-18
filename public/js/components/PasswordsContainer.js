import createPassword from './Password.js';

export default function createPasswordsContainer(parent, context) {
  const state = {
    parent,
    passwords: [],
  }

  async function fetchPasswords() {
    state.passwords = [];
    const { baseURL } = context.getState();

    const { data } = await axios.get(`${baseURL}/passwords`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });

    if (data.length !== 0) {
      data.forEach((pass) => {
        const newPass = createPassword(pass, context);
        state.passwords.push(newPass);
      });
    }
  }

  function renderPasswords() {
    return state.passwords.reduce((acc, curr) => acc + curr.render(), '');
  }

  function setupEvents() {
    document.querySelector('#new-pass')
      .addEventListener('click', () => context.setState({ newBox: true }));

    state.passwords.forEach(pass => pass.setupEvents());
  }

  function render() {
    return `
      <div class="section-header">
        <p class="title">Your Passwords</p>
        <button id="new-pass" class="new-password">New</button>
      </div>
      <div class="passwords-container">${renderPasswords()}</div>
      <div id="no-pass" class="no-passwords">You don't have any saved passwords yet</div>
    `;
  }

  async function update() {
    await fetchPasswords();
    document.querySelector(state.parent).innerHTML = render();
    setupEvents();

    if (state.passwords.length === 0 ) {
      document.querySelector('#no-pass').classList.add('no-passwords-enabled');
    }
  }

  return {
    update,
  }
}
