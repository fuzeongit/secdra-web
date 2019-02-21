import httpUtil from "../assets/js/util/httpUtil";

const state = {};

const mutations = {};

const actions = {
  //发表评论
  async ASave(context, params) {
    return await httpUtil.post("/comment/save", params);
  },

  async AList(context, params) {
    return await httpUtil.get("/comment/list", params);
  },

  async AListTop4(context, params) {
    return await httpUtil.get("/comment/listTop4", params);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
