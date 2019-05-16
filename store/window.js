export const state = () => ({
  scrollTop: 0,
  scrollBottom: 0
});

export const mutations = {
  MChangesScroll(state, {scrollTop, scrollBottom}) {
    state.scrollTop = scrollTop;
    state.scrollBottom = scrollBottom;
  }
};

export const actions = {};
