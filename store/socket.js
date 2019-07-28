export const state = () => ({
  status: null
});

export const mutations = {
  MSetStatus(state, status) {
    state.status = status;
  }
};
