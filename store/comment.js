import httpUtil from "../assets/js/util/httpUtil";

const state = {};

const mutations = {};

const actions = {
  //发表评论
  async ASave(context, params) {
    return await httpUtil.post("/comment/save", params);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
