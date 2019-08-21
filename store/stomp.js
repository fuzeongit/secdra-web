import stompUtil from "../assets/script/util/stompUtil"

export const state = () => ({
  status: null
})

export const mutations = {
  MSetStatus(state, status) {
    state.status = status
  }
}

export const actions = {
  // 连接socket
  async AStompConnect(context, params) {
    await stompUtil.connect()
    context.commit("MSetStatus", true)
  },
  // 断开socket
  async AStompDisconnect(context, params) {
    await stompUtil.disconnect()
    context.commit("MSetStatus", false)
  }
}
