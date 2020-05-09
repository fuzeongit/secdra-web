export const FRAMES_SECOND = 16

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
  CollectState: enumProxy({
    CONCERNED: "已关注",
    STRANGE: "未关注",
    SElF: "自己"
  }),
  FollowState: enumProxy({
    CONCERNED: "已关注",
    STRANGE: "未关注",
    SElF: "自己"
  }),
  Gender: enumProxy({
    MALE: "男",
    FEMALE: "女"
  }),
  PrivacyState: enumProxy({
    PUBLIC: "公开",
    PRIVATE: "隐藏"
  }),
  PictureLifeState: enumProxy({
    DISAPPEAR: "不存在",
    EXIST: "正常"
  })
}

function enumProxy(object) {
  const o = {}
  Object.keys(object).forEach((key) => {
    o[key] = { key, value: object[key] }
  })
  return o
}
