import httpUtil from "../assets/js/util/httpUtil";
import {Result} from "../assets/js/model/base";

const state = {};

const mutations = {};

const actions = {
  async APaging(context, params) {
    return await httpUtil.get("/draw/paging", params);
  },
  async AListByRecommend(context, params) {
    return await httpUtil.get("/draw/listByRecommend", params);
  },
  async APagingByRecommend(context, params) {
    return await httpUtil.get("/draw/pagingByRecommend", params);
  },
  async ACollection(context,params){
    return await httpUtil.post("/collection/focus", params);
  },
  async AUnCollection(context,params){
    return await httpUtil.post("/collection/unFocus", params);
  },
  async AGetFirstByTag(context,params){
    return await httpUtil.get("/draw/getFirstByTag",params);
  },
  async ACountByTag(context,params){
    return await httpUtil.get("/draw/countByTag",params);
  },
  async APagingByUserId(context,params){
    return await httpUtil.get("/draw/pagingByUserId",params);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
