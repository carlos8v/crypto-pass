export default function createDeleteBox(parent, context) {
  const state = {
    parent,
    input: '',
  }
  
  function handleInput(value) {
    const { username, currentPass: { service } } = context.getState();
  
    state.input = value;
    const deleteButton = document.querySelector('#delete-btn');
    if (value === `${username}/${service}`) {
      deleteButton.removeAttribute('disabled');
    } else {
      deleteButton.setAttribute('disabled', '');
    }
  }

  async function handleDelete(e) {
    e.preventDefault();

    const { baseURL, currentPass: { password_id } } = context.getState();

    try {
      await axios.delete(`${baseURL}/passwords/${password_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      context.setState({
        currentPass: {},
        deleteBox: false,
        passwordsCount: context.getState().passwordsCount - 1,
      });

    } catch ({ response }) {
      if (response.status === 401) {
        alert('User was not authorized');
        localStorage.removeItem('token');
        window.location.href = baseURL;
      }
    }
  }

  function toggleBoxEnable() {
    const { deleteBox: isActive } = context.getState();
    const contrast = document.querySelector('.contrast');
    const deleteBox = document.querySelector('#delete-box');
    
    if (isActive && !deleteBox.classList.contains('box-active')) {
      contrast.classList.add('contrast-active');
      deleteBox.classList.add('box-active');
    } else if (!isActive && deleteBox.classList.contains('box-active')) {
      contrast.classList.remove('contrast-active');
      deleteBox.classList.remove('box-active');
    }
  }

  function setupEvents() {
    document.querySelector('#delete-close')
      .addEventListener('click', () => context.setState({ deleteBox: false }));
    
    document.querySelector('#delete-input')
      .addEventListener('input', ({ target }) => handleInput(target.value));
    
    document.querySelector('#delete-form').addEventListener('submit', handleDelete);
  }

  function render() {
    const { username, currentPass: { service } } = context.getState();

    return `
      <header class="box-header">
        <p>Are you sure?</p>
        <button class="box-header-btn" id="delete-close">
          <i class="fas fa-times"></i>
        </button>
      </header>
      <div class="warn">You won't be able to recover this password</div>
      <main class="box-content">
        <p>Please type <strong>${username}/${service}</strong> to confirm.</p>
        <form id="delete-form" class="delete-form">
          <input type="text" class="box-input" id="delete-input">
          <button id="delete-btn" class="box-btn delete-btn" disabled>I understand the consequences, delete this password</button>
        </form>
      </main>
    `;
  }

  function update() {
    document.querySelector(state.parent).innerHTML = render();
    setupEvents();
    toggleBoxEnable();
  }

  return {
    update,
  }
}
