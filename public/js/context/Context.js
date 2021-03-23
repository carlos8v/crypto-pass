export default function createContext(state = {}) {
  const observers = [];

  function subscribe(observerFunction, dependenciesList) {
    observers.push({ observerFunction, dependenciesList });
  }

  function hasChanged(oldState) {
    const modifiedDependencies = [];
    for (const field in oldState) {
      if (oldState[field] !== state[field])
        modifiedDependencies.push(field);
    }

    notifyAll(modifiedDependencies);
  }

  function notifyAll(modifiedDependencies) {
    observers.forEach(async ({ observerFunction, dependenciesList }) => {
      if (dependenciesList.some((dep) => modifiedDependencies.includes(dep))) {
        await observerFunction();
      }
    });
  }

  function setState(newState) {
    const oldState = Object.assign({}, state);

    Object.assign(state, newState);

    hasChanged(oldState);
  }

  function getState() {
    return state;
  }

  return {
    subscribe,
    setState,
    getState,
  }
}
