import httpUtil from "../assets/script/util/httpUtil";

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
  systemCount: 0,
});

export const mutations = {
  MChangeType(state, {type, reset}) {
    state.type = type;
    if(reset){
      state[type + 'Count'] = 0;
    }
  },
  MChangeCount(state, {type, count}) {
    state[type + 'Count'] = count;
  }
};

export const actions = {
  //获取未读条数
  async ACount(context, params) {
    return await httpUtil.get("/message/count", params);
  },
  //获取未读列表
  async AListUnread(context, params) {
    return await httpUtil.get("/message/listUnread", params);
  },
  //获取全部
  async AList(context, params) {
    return await httpUtil.get("/message/list", params);
  },
  //获取
  async ASaveSetting(context, params) {
    return await httpUtil.post("/message/saveSettings", params);
  },
};

