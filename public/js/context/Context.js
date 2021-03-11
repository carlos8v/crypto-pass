const Context = {
  state: {
    baseURL: '',
    username: '',
    passwordsCount: 0,
    currentPass: {},
    deleteBox: false,
    observers: [],
  },
  subscribe(observer, dependenciesList) {
    this.state.observers.push({ observer, dependenciesList });
  },
  hasChanged(oldState) {
    const modifiedDependencies = [];
    for (const state in oldState) {
      if (oldState[state] !== this.state[state])
        modifiedDependencies.push(state);
    }

    this.notifyAll(modifiedDependencies);
  },
  notifyAll(modifiedDependencies) {
    this.state.observers.forEach(async ({ observer, dependenciesList }) => {
      if (dependenciesList.some((dep) => modifiedDependencies.includes(dep))) {
        await observer.update();
      }
    });
  },
  setState(newState) {
    const oldState = this.state;

    this.state = {
      ...oldState,
      ...newState,
    }

    this.hasChanged(oldState);
  },
  getState() {
    return this.state;
  }
}

export default Context;
