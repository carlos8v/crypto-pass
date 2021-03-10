import {
  getInfo,
  fetchUser,
  handleNotification,
  initializeBoxes,
  toggleBoxEnable,
} from './utils.js';

async function handleLogout() {
  localStorage.removeItem('token');

  const { baseURL } = await getInfo();
  window.location.href = baseURL;
}

function noPasswordsSaved() {
  const noPass = document.querySelector('.no-passwords-saved');
  noPass.classList.add('no-passwords-saved-enabled');
}

function toggleVisibility(visibility, passInfo) {
  visibility.classList.toggle('password-visibility-enabled');
  passInfo.classList.toggle('password-enabled');
}

function handleCopy(password) {
  navigator.clipboard.writeText(password.innerText);
  handleNotification('.copy', 'Password copied to clipboard');
}

async function handleDelete(password_id, service) {
  const { username } = await fetchUser();
  document.querySelector('.pass-name').innerText = `${username}/${service}`;
  
  const deleteButton = document.querySelector('.delete-btn');
  deleteButton.setAttribute('disabled', '');
  toggleBoxEnable('.delete-box');

  const deleteInput = document.querySelector('.delete-input');
  deleteInput.setAttribute('pass-id', password_id);
  deleteInput.setAttribute('service', service);
}

function createPassword({ password_id, service, password }) {
  const passContainer = document.querySelector('.passwords-container');
  const passContent = document.createElement('div');
  passContent.classList.add('password-container');

  const serviceInfo = document.createElement('div');
  serviceInfo.innerHTML = `<i class="fas fa-cog"></i> <p>${service}</p>`;
  serviceInfo.classList.add('password-info');

  const passInfo = document.createElement('div');
  passInfo.innerHTML = `<i class="fas fa-key"></i> <p>${password}</p>`;
  passInfo.classList.add('password-info');
  passInfo.classList.add('password');

  const visibility = document.createElement('p');
  visibility.classList.add('password-visibility');
  visibility.addEventListener('click', () => toggleVisibility(visibility, passInfo));

  const copyAction = document.createElement('button');
  copyAction.innerText = 'copy';
  copyAction.addEventListener('click', () => handleCopy(passInfo));

  const deleteAction = document.createElement('button');
  deleteAction.innerText = 'delete';
  deleteAction.addEventListener('click', () => handleDelete(password_id, service));

  const actionsContainer = document.createElement('div');
  actionsContainer.classList.add('actions-container');
  actionsContainer.appendChild(copyAction);
  actionsContainer.appendChild(deleteAction);

  passContent.appendChild(serviceInfo);
  passContent.appendChild(passInfo);
  passContent.appendChild(actionsContainer);
  passContent.appendChild(visibility);

  passContainer.appendChild(passContent);
}

async function fetchPasswords() {
  const { baseURL } = await getInfo();

  const { data } = await axios.get(`${baseURL}/passwords`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  });

  if (data.length === 0) noPasswordsSaved();
  else data.forEach(pass => createPassword(pass));

  document.querySelector('.passwords-count').innerText = data.length;
}

async function initializeUser() {
  const { username } = await fetchUser();
  document.querySelector('.username').innerText = username;
}

function initializeEventsListeners() {
  document.querySelector('.log-out').addEventListener('click', handleLogout);
  initializeBoxes();
  initializeDeleteListeners();
}

function initializeDeleteListeners() {
  const deleteButton = document.querySelector('.delete-btn');
  const deleteInput = document.querySelector('.delete-input')

  deleteInput.addEventListener('input', async ({ target }) => {
    const { username } = await fetchUser();
    const service = deleteInput.getAttribute('service');

    if (target.value === `${username}/${service}`) {
      deleteButton.removeAttribute('disabled');
    } else {
      if (!deleteButton.hasAttribute('disabled')) {
        deleteButton.setAttribute('disabled', '');
      }
    }
  });

  deleteButton.addEventListener('click', async () => {
    const { baseURL } = await getInfo();
    const password_id = deleteInput.getAttribute('pass-id');

    try {
      await axios.delete(`${baseURL}/passwords/${password_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      document.querySelector('.passwords-container').innerHTML = '';
      await fetchPasswords();
      toggleBoxEnable('.delete-box');

    } catch ({ response }) {
      if (response.status === 401) {
        alert('User was not authorized');
        localStorage.removeItem('token');
        window.location.href = baseURL;
      }
    }
  });
}

window.onload = async () => {
  await initializeUser();
  await fetchPasswords();
  initializeEventsListeners();
}
