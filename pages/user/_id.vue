<template>
  <div class="page">
    <SelfHome v-if="self"></SelfHome>
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
    self() {
      return (
        !this.$route.params.id ||
        this.$store.state.user.user.id === this.$route.params.id
      )
    }
  },
  // 在这里不能使用httpUtil
  // 并且嵌套层数超过不知道多少会报错-->坑死我了
  async asyncData({ store, redirect, route, $axios }) {
    const selfUser = store.state.user.user
    const taskList = []
    taskList.push(
      $axios.get(`/user/get`, {
        params: { id: route.params.id || selfUser.id }
      })
    )
    if (selfUser.id && selfUser.id === route.params.id) {
      taskList.push($axios.get(`/qiniu/getUploadToken`))
    }
    const resultList = (await Promise.all(taskList)).map((item) => item.data)
    if (resultList[0].status === 401) {
      redirect(`/login?r=${route.fullPath}`)
      return
    }
    const user = resultList[0].data
    if (selfUser.id === user.id) {
      store.commit("menu/MChangeName", "user")
      store.commit("user/MSetUserInfo", user)
      store.commit(
        "user/MSetUploadToken",
        resultList[1] ? resultList[1].data : null
      )
    } else {
      store.commit("menu/MChangeName", "")
    }
    return {
      user
    }
  },
  head() {
    const title = this.self ? "我的个人中心" : this.user.name + "的个人中心"
    return { title: title + " - Secdra" }
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
