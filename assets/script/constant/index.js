import proxyUtil from "../util/proxyUtil"

export function listConstant() {
  const visualWidth = 1120
  const pageGap = 24
  const gap = 24
  const colNumber = 4
  return new Proxy(
    {
      pageGap,
      gap,
      visualWidth,
      colNumber,
      colWidth: null,
      infoHeight: 80,
      widthOffset: gap,
      heightOffset: gap,
      update(colNumber, gap) {
        this.colNumber = colNumber
        this.gap = gap
      }
    },
    {
      get(target, key) {
        if (key === "colWidth") {
          return (
            (target.visualWidth - (target.colNumber + 1) * target.gap) /
            target.colNumber
          )
        } else if (key === "widthOffset" || key === "heightOffset") {
          return target.gap
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
  DrawLifeState: proxyUtil.enumProxy({
    DISAPPEAR: "不存在",
    EXIST: "正常"
  })
}
