import httpUtil from "../assets/js/util/httpUtil";

/**
 *  有关notify的仓库
 *
 *  @author fjj
 */

const state = {

};

const mutations = {

};

const actions = {
  //获取未读条数
  async ACount(context, params) {
    return await httpUtil.get("/message/count", params);
  },
  //获取未读列表
  async AListUnread(context, params) {
    return await httpUtil.get("/message/listUnread", params);
  },
  //获取全部
  async AList(context, params) {
    return await httpUtil.get("/message/list", params);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

