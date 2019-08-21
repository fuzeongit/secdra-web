import httpUtil from "../assets/script/util/httpUtil"

export const state = () => ({})

export const mutations = {}

export const actions = {
  // 发表回复
  ASaveReply(context, params) {
    return httpUtil.post("/reply/save", params)
  },
  AList(context, params) {
    return httpUtil.get("/reply/list", params)
  }
}
