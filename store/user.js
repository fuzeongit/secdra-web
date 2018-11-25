import httpUtil from '../assets/js/util/httpUtil'

/**
 *  有关user的仓库
 *
 *  @author fjj
 */

const state = {
  user: null,
  uploadToken: ""
};

const mutations = {
  MSetUserInfo(state, user) {
    state.user = user;
  },
};

const actions = {
  async ALogin(context, params) {
    let result = await httpUtil.post("/user/login", params);
    if (result.status === 200) {
      context.commit("MSetUserInfo", result.data)
    }
    return result
  },
  async ARegister(context, params) {
    let result = await httpUtil.post("/user/register", params);
    if (result.status === 200) {
      context.commit("MSetUserInfo", result.data)
    }
    return result
  },
  async AGetInfo(context, params) {
    return await httpUtil.get("/user/getInfo", params)
  },
  async AFollow(context, params) {
    return await httpUtil.post("/follower/focus", params)
  },
  async APagingFollower(context, params) {
    return await httpUtil.post("/follower/paging", params)
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

