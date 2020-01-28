import proxyUtil from "../util/proxyUtil"

export function listConstant() {
  const visualWidth = 1120
  const pageGap = 24
  const gap = 24
  const columnNumber = 4
  return new Proxy(
    {
      pageGap,
      gap,
      visualWidth,
      columnNumber,
      columnWidth: null,
      infoHeight: 80,
      lastCardHeightProportion: 1.2,
      lastCardHeight: null,
      update(columnNumber, gap) {
        this.columnNumber = columnNumber
        this.gap = gap
      }
    },
    {
      get(target, key) {
        if (key === "columnWidth") {
          return (
            (target.visualWidth - (target.columnNumber + 1) * target.gap) /
            target.columnNumber
          )
        } else if (key === "lastCardHeight") {
          return (
            ((target.visualWidth - (target.columnNumber + 1) * target.gap) /
              target.columnNumber) *
            target.lastCardHeightProportion
          )
        }
        return target[key]
      }
    }
  )
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
  PictureLifeState: proxyUtil.enumProxy({
    DISAPPEAR: "不存在",
    EXIST: "正常"
  })
}
