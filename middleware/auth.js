import { createResult } from "../assets/script/model"

export default async ({ store, redirect, route, $axios }) => {
  let result = createResult(200)
  const user = store.state.user.user || {}
  try {
    let responses = {}
    if (!user.id) {
      responses = await $axios.get(`/user/get`)
      result = responses.data
      if (result.status === 200) {
        store.state.user.user = result.data
      }
    }
  } catch (e) {
    result = createResult(401, e, "请登录")
  }
  if (result.status !== 200 && route.fullPath !== "/login") {
    redirect(`/login?r=${route.fullPath}`)
  }
}
