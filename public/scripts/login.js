import { getInfo, handleNotification } from './utils.js';

async function handleLogin(e) {
  e.preventDefault();
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  const { baseURL } = await getInfo();
  try {
    const { data } = await axios.get(`${baseURL}/users/find`, {
      auth: {
        username,
        password,
      },
    })
    
    localStorage.setItem('token', data.token);
    window.location.href = `${baseURL}/home`;
  } catch {
    handleNotification('.error', 'Username or password does not match');
  }
}

window.onload = async () => {
  document.querySelector('.login-form').addEventListener('submit', handleLogin);

  if (localStorage.getItem('token') !== null) {
    const { baseURL } = await getInfo();
    window.location.href = `${baseURL}/home`;
  }
}
