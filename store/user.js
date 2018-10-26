import httpUtil from '../assets/js/util/httpUtil'

/**
 *  有关user的仓库
 *
 *  @author fjj
 */

const state = {
  user: null
};

const mutations = {
  MSetUserInfo(state, user) {
    state.user = user;
  }
};

const actions = {
  async ALogin(context, params) {
    let result = await httpUtil.post("/user/login",params);
    if (result.status === 200) {
      context.commit("MSetUserInfo", result.data)
    }
    return result
  },
  async ARegister(context, params) {
    let result = await httpUtil.post("/user/register",params);
    if (result.status === 200) {
      context.commit("MSetUserInfo", result.data)
    }
    return result
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

