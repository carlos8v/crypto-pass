import { handleNotification } from '../utils.js';

export default function createNewBox(parent, context, document) {
  const state = {
    parent,
    input: '',
  }

  function handleInput(value) {
    state.input = value;

    const newButton = document.querySelector('#new-btn');
    if (value !== '') {
      newButton.removeAttribute('disabled');
    } else {
      newButton.setAttribute('disabled', '');
    }
  }

  async function handleNew(e) {
    e.preventDefault();
    
    const newButton = document.querySelector('#new-btn');
    newButton.setAttribute('disabled', '');

    const { baseURL } = context.getState();

    try {
      await axios.post(`${baseURL}/passwords/new`, {
        service: state.input,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      context.setState({
        newBox: false,
        passwordsCount: context.getState().passwordsCount + 1,
      });

    } catch({ response: { data }}) {
      const { error: { code } } = data;
      if (code === 'SQLITE_CONSTRAINT') {
        handleNotification('error', 'Service has already been chosen');
      } else {
        handleNotification('error', 'An internal error has occurred');
      }
      newButton.removeAttribute('disabled');
    }
  }

  function toggleBoxEnable() {
    const { newBox: isActive } = context.getState();
    const contrast = document.querySelector('.contrast');
    const newBox = document.querySelector('#new-box');
    
    if (isActive && !newBox.classList.contains('box-active')) {
      contrast.classList.add('contrast-active');
      newBox.classList.add('box-active');
    } else if (!isActive && newBox.classList.contains('box-active')) {
      contrast.classList.remove('contrast-active');
      newBox.classList.remove('box-active');
    }
  }

  function setupEvents() {
    document.querySelector('#new-close')
      .addEventListener('click', () => context.setState({ newBox: false }));
    
    document.querySelector('#new-input')
      .addEventListener('input', ({ target }) => handleInput(target.value));
    
    document.querySelector('#new-form').addEventListener('submit', handleNew);
  }

  function render() {
    return `
      <header class="box-header">
        <p>Create new password</p>
        <button class="box-header-btn" id="new-close">
          <i class="fas fa-times"></i>
        </button>
      </header>
      <div class="warn">The service name must be <strong>unique</strong></div>
      <main class="box-content">
        <p>Please type the service name.</p>
        <form id="new-form" class="delete-form">
          <input type="text" class="box-input" id="new-input">
          <button id="new-btn" class="box-btn new-btn" disabled>Create password</button>
        </form>
      </main>
    `;
  }

  function update() {
    document.querySelector(parent).innerHTML = render();
    setupEvents();
    toggleBoxEnable();
  }

  return {
    update,
  }
}
