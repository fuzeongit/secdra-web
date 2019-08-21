import httpUtil from "../assets/script/util/httpUtil"

export const state = () => ({})

export const mutations = {}

export const actions = {
  // 发表评论
  ASave(context, params) {
    return httpUtil.post("/comment/save", params)
  },

  AList(context, params) {
    return httpUtil.get("/comment/list", params)
  },

  AListTop4(context, params) {
    return httpUtil.get("/comment/listTop4", params)
  },
  AListReply(context, params) {
    return httpUtil.get("/reply/list", params)
  }
}
