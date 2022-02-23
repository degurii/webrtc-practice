const freeze = state => Object.freeze(state);
const invoke = (state, listeners) => {
  const freezed = freeze(state);
  listeners.forEach(listener => listener(freezed));
};

const createStore = reducer => {
  let listeners = [];
  let state = reducer(undefined, { type: null });

  const subscribe = listener => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  const dispatch = action => {
    const newState = reducer(state, action);
    if (newState === state) {
      return;
    }
    state = newState;
    invoke(state, listeners);
  };

  const getState = () => freeze(state);
  return { subscribe, dispatch, getState };
};

export default {
  createStore,
};
