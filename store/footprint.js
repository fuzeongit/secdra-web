import httpUtil from "../assets/script/util/httpUtil"

export const state = () => ({})

export const mutations = {}

export const actions = {
  // 保存足迹
  ASave(context, params) {
    return httpUtil.post("/footprint/save", params)
  },
  // 获取分页足迹
  APaging(context, params) {
    return httpUtil.get("/footprint/paging", params)
  }
}
