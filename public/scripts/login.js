import { getInfo } from './utils.js';

async function handleLogin(e) {
  e.preventDefault();
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  const { baseURL } = await getInfo();
  const response = await fetch(`${baseURL}/users/find?username=${username}&password=${password}`);
  const data = await response.json();
  
  if (!data.error) window.location.href = 'http://localhost/home';
  else handleError(data.error)
}

function handleError(err) {
  const errorModal = document.querySelector('.error-modal');
  errorModal.innerHTML = err;
  errorModal.classList.toggle('error-modal--active');
  const errorModalActive = document.querySelector('.error-modal--active');
  if (errorModalActive) {
    errorModalActive.addEventListener("animationend", () => {
      errorModalActive.classList.remove('error-modal--active');
    });
  }
}

window.onload = () => {
  document.querySelector('.login-form').addEventListener('submit', handleLogin);
}
