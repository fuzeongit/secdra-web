import httpUtil from "../assets/js/util/httpUtil";

const state = {};

const mutations = {};

const actions = {
  //发表回复
  async ASave(context, params) {
    return await httpUtil.post("/reply/save", params);
  },
  async AList(context, params){
    return await httpUtil.get("/reply/list", params);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
