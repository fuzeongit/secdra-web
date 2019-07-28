import stompUtil from "../assets/script/util/stompUtil";

export const state = () => ({
  status: null
});

export const mutations = {
  MSetStatus(state, status) {
    state.status = status;
  }
};

export const actions = {
  //连接socket
  async ASocketConnect(context, params) {
    await stompUtil.connect();
    context.commit("MSetStatus", true)
  },
  //断开socket
  async ASocketDisconnect(context, params) {
    await stompUtil.disconnect();
    context.commit("MSetStatus", false)
  },
};
