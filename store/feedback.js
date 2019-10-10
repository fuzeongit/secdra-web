import httpUtil from "../assets/script/util/httpUtil"

export const state = () => ({})

export const mutations = {}

export const actions = {
  // 保存反馈
  ASave(context, params) {
    return httpUtil.post("/feedback/save", params)
  }
}
