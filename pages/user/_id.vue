<template>
  <div class="page">
    <SelfHome v-if="isSelf"></SelfHome>
    <OtherHome v-else :user="user" @follow="follow"></OtherHome>
    <CornerButtons></CornerButtons>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import SelfHome from "../../components/pages/user/SelfHome"
import OtherHome from "../../components/pages/user/OtherHome"
import CornerButtons from "../../components/pages/shared/CornerButtons"

export default {
  components: {
    SelfHome,
    OtherHome,
    CornerButtons
  },
  computed: {
    isSelf() {
      return this.$store.state.user.user.id === this.$route.params.id
    }
  },
  // 在这里不能使用httpUtil
  // 并且嵌套层数超过不知道多少会报错-->坑死我了
  async asyncData({ store, redirect, route, $axios }) {
    const selfUser = store.state.user.user
    const taskList = []
    taskList.push($axios.get(`/user/get`, { params: { id: route.params.id } }))
    if (selfUser.id === route.params.id) {
      taskList.push($axios.get(`/qiniu/getUploadToken`))
    }
    const resultList = (await Promise.all(taskList)).map((item) => item.data)

    if (resultList[0].status !== 200) {
      redirect(`/user/${selfUser.id}`)
    }
    const user = resultList[0].data
    if (selfUser.id === user.id) {
      store.commit("menu/MChangeName", "user")
      store.commit("user/MSetUserInfo", user)
      store.commit("user/MSetUploadToken", resultList[1].data)
    } else {
      store.commit("menu/MChangeName", "")
    }
    return {
      user
    }
  },
  methods: {
    ...mapActions("user", ["AFollow"]),
    async follow() {
      const result = await this.AFollow({
        followingId: this.user.id
      })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.user.focus = result.data
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../assets/style/color";
@import "../../assets/style/config";
@import "../../assets/style/mixin";
</style>
