<template>
  <div class="page">
    <DrawList :page="page" :list="list" :pageLoading="pageLoading" @paging="paging" @collection="collection"
              @follow="follow"></DrawList>
    <CornerButtons></CornerButtons>
  </div>
</template>

<script>
  import {Pageable} from "../assets/script/model";
  import {mapActions} from "vuex"
  import DrawList from "../components/pages/shared/DrawList"
  import CornerButtons from "../components/pages/shared/CornerButtons"

  export default {
    components: {
      DrawList,
      CornerButtons
    },
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      store.commit('menu/MChangeName', "new");
      let pageable = new Pageable();
      pageable.size = 16;
      pageable.sort = "createDate,desc";
      let {data: result} = await $axios.get(`/draw/paging`, {
        params: Object.assign({}, pageable)
      });
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      return {
        page: result.data,
        list: result.data.content,
        pageable
      }
    },
    data() {
      return {
        pageLoading: false
      }
    },
    methods: {
      ...mapActions("draw", ["APaging", "ACollection"]),
      ...mapActions("user", ["AFollow"]),
      /**
       * 获取分页数据
       * @returns {Promise<void>}
       */
      async paging() {
        if (this.pageLoading || this.page.last) {
          return
        }
        let sourcePage = ++this.pageable.page;
        this.pageLoading = true;
        let result = await this.APaging(Object.assign({
            tag: this.$route.params.tag
          }, this.pageable)
        );
        this.pageLoading = false;
        let data = result.data;
        if (result.status !== 200) {
          this.$notify({message: result.message});
          this.pageable.page = sourcePage;
          return
        }
        this.page = data;
        this.list.merge(data.content)
      },
      async collection(draw) {
        let result = await this.ACollection({
          drawId: draw.id
        });
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        draw.focus = result.data
      },
      async follow(id) {
        let result = await this.AFollow({
          followingId: id
        });
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        for (let draw of this.list) {
          if (draw.user.id === id) {
            draw.user.focus = result.data
          }
        }
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";
</style>
