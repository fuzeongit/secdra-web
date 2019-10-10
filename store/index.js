import Vue from "vue"
import vuex from "vuex"

/**
 * vuex仓库入口
 *
 * @author fjj
 */
Vue.use(vuex)

//  暂时关闭严格模式
export const strict = false
export const actions = {
  // async nuxtServerInit({ commit }, { req, $axios }) {
  //   let result = {}
  //   let token = null
  //   try {
  //     const responses = await $axios.get(`/user/getInfo`)
  //     result = responses.data
  //     token = cookieParser.parse(req.headers.cookie).token
  //   } catch (e) {
  //     result = new Result(401, e, "请登录")
  //   }
  //   if (result.status === 200) {
  //     commit("user/MSetUserInfo", result.data)
  //     commit("user/MSetToken", token)
  //   }
  // }
  nuxtServerInit({ commit }) {
    commit("user/MSetUserInfo", null)
  }
}
