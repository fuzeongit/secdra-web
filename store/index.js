import Vue from 'vue'
import vuex from 'vuex'

/**
 * vuex仓库入口
 *
 * @author fjj
 */
Vue.use(vuex);

//  暂时关闭严格模式
// export const strict = false;
export const actions = {
  nuxtServerInit({commit}) {
    commit("user/MSetUserInfo", null)
  },
};

