import Vue from "vue"
import vuex from "vuex"
import { createResult } from "../assets/script/model"

/**
 * vuex仓库入口
 *
 * @author fjj
 */
Vue.use(vuex)

//  暂时关闭严格模式
export const strict = false
export const actions = {
  async nuxtServerInit({ commit }, { $axios }) {
    let result = {}
    try {
      const responses = await $axios.get(`/user/get`)
      result = responses.data
      if (result.status === 200) {
        commit("user/MSetUserInfo", result.data)
      }
    } catch (e) {
      result = createResult(401, e, "请登录")
    }
  }
}
