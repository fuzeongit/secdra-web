import Vue from 'vue'
import vuex, {Store} from 'vuex'
import menu from './menu'
import user from './user'
import draw from './draw'
import window from './window'

/**
 * vuex仓库入口
 *
 * @author fjj
 */
Vue.use(vuex);

/**
 * 返回工厂模式
 * @returns {Store<>}
 */
export default () => new Store({
  modules: {
    menu,
    user,
    draw,
    window
  },
  actions: {
    nuxtServerInit({commit}) {
      commit("user/MSetUserInfo", null)
    },
  }
})
