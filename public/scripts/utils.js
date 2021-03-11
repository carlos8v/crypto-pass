export async function getInfo() {
  const { data } = await axios.get('scripts/info.json');
  return data;
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
