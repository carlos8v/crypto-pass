import Context from '../context/Context.js';
import Password from './Password.js';

const PasswordContainer = {
  state: {
    parent: '.home-container',
    passwords: [],
  },
  fetchPasswords: async function() {
    this.state.passwords = [];
    const { baseURL } = Context.state;

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
  renderPasswords: function() {
    const { passwords } = this.state;
    return passwords.reduce((acc, curr) => acc + curr.render(), '');
  },
  setupEvents() {
    if (this.state.passwords.length === 0 ) {
      document.querySelector('.no-passwords-saved').classList.add('no-passwords-saved-enabled');
    }
    this.state.passwords.forEach(pass => pass.setupEvents());
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
    this.setupEvents();
  }
}

export default PasswordContainer;
