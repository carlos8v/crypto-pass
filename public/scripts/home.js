import { getInfo, handleNotification } from './utils.js';

function handleLogout() {
  document.querySelector('.log-out').addEventListener('click', async () => {
    localStorage.removeItem('token');

    const { baseURL } = await getInfo();
    window.location.href = baseURL;
  });
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

function createPassword({ service, password }) {
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

async function fetchUser() {
  const { baseURL } = await getInfo();
  
  if (!localStorage.getItem('token'))
    window.location.href = baseURL;

  try {
    const { data } = await axios.get(`${baseURL}/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    
    document.querySelector('.username').innerText = data.username;
  } catch ({ response }) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = baseURL;
    }
  }
}

window.onload = async () => {
  await fetchUser();
  await fetchPasswords();
  handleLogout();
}
