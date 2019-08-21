import httpUtil from "../assets/script/util/httpUtil"

/**
 *  有关message的仓库
 *
 *  @author fjj
 */

export const state = () => ({
  type: "",
  commentCount: 0,
  replyCount: 0,
  followCount: 0,
  systemCount: 0
})

export const mutations = {
  MChangeType(state, { type, reset }) {
    state.type = type
    if (reset) {
      state[type + "Count"] = 0
    }
  },
  MChangeCount(state, { type, count }) {
    state[type + "Count"] = count
  }
}

export const actions = {
  // 获取未读条数
  ACount(context, params) {
    return httpUtil.get("/message/count", params)
  },
  // 获取未读列表
  AListUnread(context, params) {
    return httpUtil.get("/message/listUnread", params)
  },
  // 获取全部
  AList(context, params) {
    return httpUtil.get("/message/list", params)
  },
  // 获取
  ASaveSetting(context, params) {
    return httpUtil.post("/message/saveSettings", params)
  }
}
