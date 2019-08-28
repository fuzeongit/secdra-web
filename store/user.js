import httpUtil from "../assets/script/util/httpUtil"

/**
 *  有关user的仓库
 *
 *  @author fjj
 */

export const state = () => ({
  user: null,
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
      // TODO
      throw e
    }
  },
  MSetUploadToken(state, uploadToken) {
    state.uploadToken = uploadToken
  }
}

export const actions = {
  // 登录
  async ALogin(context, params) {
    const result = await httpUtil.post("/user/login", params)
    if (result.status === 200) {
      context.commit("MSetUserInfo", result.data)
    }
    return result
  },
  // 注册
  async ARegister(context, params) {
    const result = await httpUtil.post("/user/register", params)
    if (result.status === 200) {
      context.commit("MSetUserInfo", result.data)
    }
    return result
  },
  // 获取用户信息
  AGetInfo(context, params) {
    return httpUtil.get("/user/getInfo", params)
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
  // 分页获取关注用户
  APagingFollowing(context, params) {
    return httpUtil.get("/following/paging", params)
  },
  // 分页获取粉丝
  APagingFollower(context, params) {
    return httpUtil.get("/follower/paging", params)
  }
}
