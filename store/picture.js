import httpUtil from "../assets/script/util/httpUtil"
import { FliterForm } from "../assets/script/model"

export const state = () => ({
  filterForm: new FliterForm()
})

export const mutations = {
  MChangeFilterForm(state, filterForm) {
    state.filterForm = filterForm
  }
}

export const actions = {
  // 分页获取数据
  APaging(context, params) {
    return httpUtil.get("/picture/paging", params)
  },
  // 获取推荐列表
  AListByRecommend(context, params) {
    return httpUtil.get("/picture/listByRecommend", params)
  },
  // 分页获取推荐
  APagingByRecommend(context, params) {
    return httpUtil.get("/picture/pagingByRecommend", params)
  },
  // 获取分页收藏
  APagingCollection(context, params) {
    return httpUtil.get("/collection/paging", params)
  },
  // 收藏
  ACollection(context, params) {
    return httpUtil.post("/collection/focus", params)
  },
  // 批量取消收藏
  AUnCollection(context, params) {
    return httpUtil.post("/collection/unFocus", params)
  },
  // 按标签获取第一张图片
  AGetFirstByTag(context, params) {
    return httpUtil.get("/picture/getFirstByTag", params)
  },
  // 统计标签
  ACountByTag(context, params) {
    return httpUtil.get("/picture/countByTag", params)
  },
  // 保存图片
  ASave(context, params) {
    return httpUtil.post("/picture/save", params)
  },
  // 保存图片
  AUpdate(context, params) {
    return httpUtil.post("/picture/update", params)
  },
  // 批量更新图片
  ABatchUpdate(context, params) {
    return httpUtil.post("/picture/batchUpdate", params)
  }
}
