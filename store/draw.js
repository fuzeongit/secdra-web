import httpUtil from "../assets/js/util/httpUtil";

const state = {
  name:"home"
};

const mutations = {

};

const actions = {
  async APaging(context, params) {
    let result = await httpUtil.get("/draw/paging", params);
    if (result.status === 200) {
      context.commit("MSetUserInfo", result.data)
    }
    return result
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
