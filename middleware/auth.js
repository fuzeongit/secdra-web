import { Result } from "../assets/script/model"

// 严谨，通过验证接口
export default async ({ store, redirect, route, $axios }) => {
  let result = {}
  const user = store.state.user.user || {}
  try {
    let responses = {}
    if (user.id) {
      responses = await $axios.post(`/account/checkLogin`)
    } else {
      responses = await $axios.get(`/user/get`)
    }
    result = responses.data
  } catch (e) {
    result = new Result(401, e, "请登录")
  }
  if (!user.id && result.status === 200) {
    store.state.user.user = result.data
  }
  if (result.status === 200 && route.fullPath === "/login") {
    redirect("/")
  } else if (result.status !== 200 && route.fullPath !== "/login") {
    redirect("/login")
  }
}
