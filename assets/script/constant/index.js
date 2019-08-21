import proxyUtil from "../util/proxyUtil"

export class ListConstant {
  constructor() {
    this.colNumber = 4
    this.colWidth = 250
    this.infoHeight = 80
    this.widthOffset = 24
    this.heightOffset = 24
  }
}

export const enumObjectList = {
  CollectState: proxyUtil.enumProxy({
    CONCERNED: "已关注",
    STRANGE: "未关注",
    SElF: "自己"
  }),
  FollowState: proxyUtil.enumProxy({
    CONCERNED: "已关注",
    STRANGE: "未关注",
    SElF: "自己"
  }),
  Gender: proxyUtil.enumProxy({
    MALE: "男",
    FEMALE: "女"
  }),
  PrivacyState: proxyUtil.enumProxy({
    PUBLIC: "公开",
    PRIVATE: "隐藏"
  }),
  CollectDrawState: proxyUtil.enumProxy({
    EMPTY: "不存在",
    NORMAL: "正常"
  })
}
