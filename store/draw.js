import httpUtil from "../assets/js/util/httpUtil";
import {Result} from "../assets/js/model/base";

const state = {
};

const mutations = {
};

const actions = {
  async APaging(context, params) {
    let result = await httpUtil.get("/draw/pagingByTag", params);

    return result.data;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
