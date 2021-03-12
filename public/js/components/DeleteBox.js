import Context from '../context/Context.js';

const DeleteBox = {
  state: {
    parent: '#delete-box',
    input: '',
  },
  handleInput: function(value) {
    const { username } = Context.state;
    const { service } = Context.state.currentPass;
  
    this.state.input = value;
    const deleteButton = document.querySelector('#delete-btn');
    if (value === `${username}/${service}`) {
      deleteButton.removeAttribute('disabled');
    } else {
      deleteButton.setAttribute('disabled', '');
    }
  },
  handleDelete: async function(e) {
    e.preventDefault();

    const { baseURL } = Context.state;
    const { password_id } = Context.state.currentPass;

    try {
      await axios.delete(`${baseURL}/passwords/${password_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      Context.setState({
        currentPass: {},
        deleteBox: false,
        passwordsCount: Context.state.passwordsCount - 1,
      });

    } catch ({ response }) {
      if (response.status === 401) {
        alert('User was not authorized');
        localStorage.removeItem('token');
        window.location.href = baseURL;
      }
    }
  },
  toggleBoxEnable: function() {
    const { deleteBox: isActive } = Context.state;
    const contrast = document.querySelector('.contrast');
    const deleteBox = document.querySelector('#delete-box');
    
    if (isActive && !deleteBox.classList.contains('box-active')) {
      contrast.classList.add('contrast-active');
      deleteBox.classList.add('box-active');
    } else if (!isActive && deleteBox.classList.contains('box-active')) {
      contrast.classList.remove('contrast-active');
      deleteBox.classList.remove('box-active');
    }
  },
  setupEvents() {
    document.querySelector('#delete-close')
      .addEventListener('click', () => Context.setState({ deleteBox: false }));
    document.querySelector('#delete-input')
      .addEventListener('input', ({ target }) => this.handleInput(target.value));
    document.querySelector('#delete-form')
      .addEventListener('submit', (e) => this.handleDelete(e));
  },
  render() {
    const { username } = Context.state;
    const { service } = Context.state.currentPass;

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
  },
  update() {
    document.querySelector(this.state.parent).innerHTML = this.render();
    this.setupEvents();
    this.toggleBoxEnable();
  }
}

export default DeleteBox;
