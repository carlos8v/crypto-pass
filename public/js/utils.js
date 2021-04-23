async function fetchUserData(baseURL) {
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
  };
}

async function refreshToken(baseURL) {
  try {
    const response = await axios.post(`${baseURL}/refresh_token`);
    const token = response?.data?.token;
    
    if (!token) redirectToLogin(baseURL);
    localStorage.setItem('token', token);

    const { user, pass } = await fetchUserData(baseURL);

    return {
      user,
      pass,
      baseURL,
    }
    
  } catch {
    redirectToLogin(baseURL);
  }
}

export async function getInfo() {
  const { data } = await axios.get('js/info.json');
  return data;
}

export async function fetchUser() {
  const { baseURL } = await getInfo();
    
  if (!localStorage.getItem('token'))
    window.location.href = baseURL;

  try {
    const { user, pass } = await fetchUserData(baseURL);

    return {
      user,
      pass,
      baseURL,
    }
  } catch ({ response }) {
    if (response?.data?.name === 'TokenExpiredError') {
      const userData = await refreshToken(baseURL);
      return {
        ...userData,
        baseURL,
      }
    }
    
    redirectToLogin(baseURL);
  }
}

export function redirectToLogin(baseURL) {
  localStorage.removeItem('token');
  window.location.href = baseURL;
}

export function handleNotification(style, err) {
  const notification = document.querySelector('#notification');
  notification.className = `notification ${style}`;
  notification.innerHTML = err;
  notification.classList.toggle('notification-active');
  const activeNotification = document.querySelector('.notification-active');
  if (activeNotification) {
    activeNotification.addEventListener("animationend", () => {
      activeNotification.classList.remove('notification-active');
    });
  }
}
