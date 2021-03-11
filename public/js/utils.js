export async function getInfo() {
  const { data } = await axios.get('js/info.json');
  return data;
}

export async function fetchUser() {
  const { baseURL } = await getInfo();
    
  if (!localStorage.getItem('token'))
    window.location.href = baseURL;

  try {
    const { data: user } = await axios.get(`${baseURL}/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    
    const { data: pass } = await axios.get(`${baseURL}/passwords`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });

    return {
      user,
      pass,
      baseURL,
    }
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
