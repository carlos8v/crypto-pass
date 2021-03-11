import { handleNotification } from '../utils.js';
import Context from '../context/Context.js';

const Password = {
  state: {
    parent: '.passwords-container',
    service: '',
    password: '',
    password_id: 0,
  },
  handleCopy: function() {
    const { password } = this.state;
    navigator.clipboard.writeText(password);
    handleNotification('.copy', 'Password copied to clipboard');
  },
  handleDelete: function() {
    const { password_id, service, password } = this.state;
    Context.setState({
      currentPass: {
        password_id,
        service,
        password,
      },
      deleteBox: true,
    });
  },
  toggleVisibility: function() {
    const { password_id } = this.state;

    document.querySelector(`#visibility-${password_id}`)
      .classList.toggle('password-visibility-enabled');

    document.querySelector(`#pass-${password_id}`)
      .classList.toggle('password-enabled');
  },
  setupEvents() {
    const { password_id } = this.state;

    document.querySelector(`#copy-${password_id}`)
      .addEventListener('click', () => this.handleCopy());

    document.querySelector(`#delete-${password_id}`)
      .addEventListener('click', () => this.handleDelete());

    document.querySelector(`#visibility-${password_id}`)
      .addEventListener('click', () => this.toggleVisibility());
  },
  render() {
    const { password_id, service, password } = this.state;

    return `
      <div class="password-container">
        <div class="password-info">
          <i class="fas fa-cog"></i> <p>${service}</p>
        </div>
        <div id="pass-${password_id}" class="password-info password">
          <i class="fas fa-key"></i> <p>${password}</p>
        </div>
        <div class="actions-container">
          <button id="copy-${password_id}">copy</button>
          <button id="delete-${password_id}">delete</button>
        </div>
        <p id="visibility-${password_id}" class="password-visibility"></p>
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

export default Password;
