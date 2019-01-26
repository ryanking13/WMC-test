const state = {};

export const setState = (name, newState) => {
  state[name] = newState;
};

export const getState = name => state[name];
