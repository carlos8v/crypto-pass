window.onload = () => {
  document.querySelector('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const errorModal = document.querySelector('.error-modal');
  
    const baseURL = 'http://localhost:3000/users/find';
    const response = await fetch(`${baseURL}?username=${username}&password=${password}`);
    const data = await response.json();
    
    if (!data.error) {
      window.location.href = 'http://localhost/home';
    } else {
      errorModal.innerHTML = data.error;
      errorModal.classList.toggle('error-modal--active');
      const errorModalActive = document.querySelector('.error-modal--active');
      if (errorModalActive) {
        errorModalActive.addEventListener("animationend", () => {
          errorModalActive.classList.remove('error-modal--active');
        });
      }
    }
  });
}
