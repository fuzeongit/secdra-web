import Vue from 'vue'
import vuex, {Store} from 'vuex'
import menu from './menu'
import user from './user'
import draw from './draw'
import comment from './comment'
import reply from './reply'
import message from './message'
import window from './window'

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

