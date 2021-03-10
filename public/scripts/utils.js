export async function getInfo() {
  const { data } = await axios.get('scripts/info.json');
  return data;
}

export async function fetchUser() {
  const { baseURL } = await getInfo();
  
  if (!localStorage.getItem('token'))
    window.location.href = baseURL;

  try {
    const { data } = await axios.get(`${baseURL}/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    
    return data;
  } catch ({ response }) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = baseURL;
    }
  }
}

export function handleNotification(style, err) {
  const notification = document.querySelector(style);
  notification.innerHTML = err;
  notification.classList.toggle('notification-active');
  const activeNotification = document.querySelector('.notification-active');
  if (activeNotification) {
    activeNotification.addEventListener("animationend", () => {
      activeNotification.classList.remove('notification-active');
    });
  }
}

export function initializeBoxes() {
  document.querySelectorAll('.box-header-btn').forEach(closeBox => {
    closeBox.addEventListener('click', () => toggleBoxEnable(`.${closeBox.name}`));
  });
}

export function toggleBoxEnable(name) {
  const contrast = document.querySelector('.contrast');
  contrast.classList.toggle('contrast-active');
  const boxContainer = document.querySelector(name);
  boxContainer.classList.toggle('box-active');
  document.querySelector('.box-input').value = '';
}
