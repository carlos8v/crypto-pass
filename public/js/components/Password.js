import { handleNotification } from '../utils.js';

export default function createPassword(
  { service, password, password_id },
  context,
  document,
) {
  const state = {
    service,
    password,
    password_id,
  }

  function handleCopy() {
    const pass = document.querySelector(`#pass-${password_id} textarea`);
    pass.select();
    document.execCommand('copy');
    handleNotification('success', 'Password copied to clipboard');
    document.querySelector(`#copy-${password_id}`).focus();
  }

  function handleDelete() {
    const { password_id, service, password } = state;
    context.setState({
      currentPass: {
        password_id,
        service,
        password,
      },
      deleteBox: true,
    });
  }

  function toggleVisibility() {
    const { password_id } = state;

    document.querySelector(`#visibility-${password_id}`)
      .classList.toggle('password-visibility-enabled');

    document.querySelector(`#pass-${password_id}`)
      .classList.toggle('password-enabled');
  }

  function setupEvents() {
    const { password_id } = state;

    document.querySelector(`#copy-${password_id}`)
      .addEventListener('click', handleCopy);

    document.querySelector(`#delete-${password_id}`)
      .addEventListener('click', handleDelete);

    document.querySelector(`#visibility-${password_id}`)
      .addEventListener('click', toggleVisibility);
  }

  function render() {
    const { password_id, service, password } = state;

    return `
      <div class="password-container">
        <div class="password-info">
          <i class="fas fa-cog"></i> <p>${service}</p>
        </div>
        <div id="pass-${password_id}" class="password-info password">
          <i class="fas fa-key"></i> <textarea rows="1" readonly>${password}</textarea>
        </div>
        <div class="actions-container">
          <button id="copy-${password_id}">copy</button>
          <button id="delete-${password_id}">delete</button>
        </div>
        <p id="visibility-${password_id}" class="password-visibility"></p>
      </div>
    `;
  }

  return {
    render,
    setupEvents,
  };
}
