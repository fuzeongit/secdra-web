import httpUtil from "../assets/script/util/httpUtil"

/**
 *  有关user的仓库
 *
 *  @author fjj
 */

export const state = () => ({
  user: {},
  uploadToken: null
})

export const mutations = {
  MSetUserInfo(state, user) {
    state.user = user
  },
  MSetUserInfoAttr(state, { attr, value }) {
    try {
      state.user[attr] = value
    } catch (e) {
      throw e
    }
  },
  MSetUploadToken(state, uploadToken) {
    state.uploadToken = uploadToken
  }
}

export const actions = {
  // 登录
  async ASignIn(context, params) {
    const result = await httpUtil.post("/account/signIn", params)
    if (result.status === 200) {
      context.commit("MSetUserInfo", (await actions.AGet()).data)
    }
    return result
  },
  // 注册
  async ASignUp(context, params) {
    const result = await httpUtil.post("/account/signUp", params)
    if (result.status === 200) {
      context.commit("MSetUserInfo", (await actions.AGet()).data)
    }
    return result
  },
  // 获取用户信息
  AGet(context, params) {
    return httpUtil.get("/user/get", params)
  },
  // 修改用户信息
  AUpdate(context, params) {
    return httpUtil.post("/user/update", params)
  },
  // 更新背景墙
  AUpdateBack(context, params) {
    return httpUtil.post("/user/updateBack", params)
  },
  // 更新头像
  AUpdateHead(context, params) {
    return httpUtil.post("/user/updateHead", params)
  },
  // 关注用户
  AFollow(context, params) {
    return httpUtil.post("/following/focus", params)
  },
  // 按id分页获取id的关注用户列表
  APagingByFollowerId(context, params) {
    return httpUtil.get("/following/paging", params)
  },
  // 按id分页获取id的粉丝列表
  APagingByFollowingId(context, params) {
    return httpUtil.get("/follower/paging", params)
  }
}
