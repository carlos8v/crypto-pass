import { fetchUser } from '../utils.js';
import Context from '../context/Context.js';

import User from '../components/User.js';
import PasswordContainer from '../components/PasswordContainer.js';
import DeleteBox from '../components/DeleteBox.js';

async function updateDom() {
  Context.subscribe(User, ['username', 'passwordsCount']);
  Context.subscribe(PasswordContainer, ['username', 'passwordsCount']);
  Context.subscribe(DeleteBox, ['username', 'deleteBox']);
  
  const { user, pass, baseURL } = await fetchUser();
  
  Context.setState({
    username: user.username,
    passwordsCount: pass.length,
    baseURL,
  })
}

window.onload = updateDom;
