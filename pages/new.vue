<template>
  <div class="page">
    <PictureList
      :page="page"
      :list="list"
      :page-loading="pageLoading"
      @paging="paging"
      @collection="collection"
      @follow="follow"
    ></PictureList>
    <CornerButtons></CornerButtons>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import { Pageable } from "../assets/script/model"
import PictureList from "../components/pages/shared/PictureList"
import CornerButtons from "../components/pages/shared/CornerButtons"

export default {
  components: {
    PictureList,
    CornerButtons
  },
  data() {
    return {
      pageLoading: false
    }
  },
  // 在这里不能使用httpUtil
  // 并且嵌套层数超过不知道多少会报错-->坑死我了
  async asyncData({ store, $axios }) {
    store.commit("menu/MChangeName", "new")
    const pageable = new Pageable(0, 16, "createDate,desc")
    const { data: result } = await $axios.get(`/picture/paging`, {
      params: Object.assign({}, pageable)
    })
    return {
      page: result.data,
      list: result.data.content,
      pageable
    }
  },
  head() {
    return { title: "寻找最新的插画 - Secdra" }
  },
  methods: {
    ...mapActions("picture", ["APaging", "ACollection"]),
    ...mapActions("user", ["AFollow"]),
    /**
     * 获取分页数据
     * @returns {Promise<void>}
     */
    async paging() {
      if (this.pageLoading || this.page.last) {
        return
      }
      const sourcePage = ++this.pageable.page
      this.pageLoading = true
      const result = await this.APaging(
        Object.assign(
          {
            tag: this.$route.params.tag
          },
          this.pageable
        )
      )
      this.pageLoading = false
      const data = result.data
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        this.pageable.page = sourcePage
        return
      }
      this.page = data
      this.list.push(...data.content)
    },
    async collection(picture) {
      const result = await this.ACollection({
        pictureId: picture.id
      })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      picture.focus = result.data
    },
    async follow(id) {
      const result = await this.AFollow({
        followingId: id
      })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.list.forEach((item) => {
        if (item.user.id === id) {
          item.user.focus = result.data
        }
      })
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../assets/style/color";
@import "../assets/style/config";
@import "../assets/style/mixin";
</style>
