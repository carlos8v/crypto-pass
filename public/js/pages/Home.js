import { fetchUser } from '../utils.js';
import createContext from '../context/Context.js';

import createUser from '../components/User.js';
import createPasswordsContainer from '../components/PasswordsContainer.js';
import createNewBox from '../components/NewBox.js';
import createDeleteBox from '../components/DeleteBox.js';

async function loadDom() {
  const context = createContext({
    baseURL: '',
    username: '',
    passwordsCount: 0,
    currentPass: {},
    deleteBox: false,
    newBox: false,
  });

  const user = createUser('#user-container', context);
  const passwordsContainer = createPasswordsContainer('#home-container', context);
  const deleteBox = createDeleteBox('#delete-box', context);
  const newBox = createNewBox('#new-box', context);
  
  context.subscribe(user.update, ['username', 'passwordsCount']);
  context.subscribe(passwordsContainer.update, ['username', 'passwordsCount']);
  context.subscribe(newBox.update, ['username', 'newBox']);
  context.subscribe(deleteBox.update, ['username', 'deleteBox']);
  
  const { user: { username }, pass, baseURL } = await fetchUser();

  context.setState({
    username,
    passwordsCount: pass.length,
    baseURL,
  })
}

window.onload = loadDom;
