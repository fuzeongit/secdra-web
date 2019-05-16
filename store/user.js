import httpUtil from '../assets/script/util/httpUtil'

/**
 *  有关user的仓库
 *
 *  @author fjj
 */

export const state = ()=>({
  user: null,
  uploadToken: null
});

export const mutations = {
  MSetUserInfo(state, user) {
    state.user = user;
  },
  MSetUploadToken(state, uploadToken) {
    state.uploadToken = uploadToken;
  },
};

export const actions = {
  //登录
  async ALogin(context, params) {
    let result = await httpUtil.post("/user/login", params);
    if (result.status === 200) {
      context.commit("MSetUserInfo", result.data)
    }
    return result
  },
  //注册
  async ARegister(context, params) {
    let result = await httpUtil.post("/user/register", params);
    if (result.status === 200) {
      context.commit("MSetUserInfo", result.data)
    }
    return result
  },
  //获取用户信息
  async AGetInfo(context, params) {
    return await httpUtil.get("/user/getInfo", params)
  },
  //修改用户信息
  async AUpdate(context, params) {
    return await httpUtil.post("/user/update", params)
  },
  //更新背景墙
  async AUpdateBack(context, params) {
    return await httpUtil.post("/user/updateBack", params)
  },
  //更新头像
  async AUpdateHead(context, params) {
    return await httpUtil.post("/user/updateHead", params)
  },
  //关注用户
  async AFollow(context, params) {
    return await httpUtil.post("/following/focus", params)
  },
  // 分页获取关注用户
  async APagingFollowing(context, params) {
    return await httpUtil.get("/following/paging", params)
  },
  // 分页获取粉丝
  async APagingFollower(context, params) {
    return await httpUtil.get("/follower/paging", params)
  }
};
