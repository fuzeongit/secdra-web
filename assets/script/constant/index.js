import proxyUtil from "../util/proxyUtil"

export function listConstant() {
  return {
    colNumber: 4,
    colWidth: 250,
    infoHeight: 80,
    widthOffset: 24,
    heightOffset: 24
  }
}

export function hideFooterMenuConstant() {
  return ["search", "find", "new", "message"]
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
  DrawLifeState: proxyUtil.enumProxy({
    DISAPPEAR: "不存在",
    EXIST: "正常"
  })
}
