<template>
  <div class="page">
    <DrawList :page="page" :list="list" :pageLoading="pageLoading" @paging="paging" @collection="collection" @follow="follow"></DrawList>
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <button class="btn is-suspend go-top" v-goTop v-show="showGoTop">
        <i class="icon s-up"></i></button>
    </transition>
  </div>
</template>

<script>
  import config from "../assets/js/config/index";
  import {Pageable} from "../assets/js/model/base";
  import {ListConstant} from "../assets/js/constant/base";
  import {mapActions} from "vuex"
  import DrawList from "../components/pages/shared/DrawList"

  export default {
    components:{
      DrawList
    },
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "new";
      let pageable = new Pageable();
      pageable.size = 16;
      pageable.sort = "createDate,desc";
      let {data: result} = await $axios.get(`${config.host}/draw/paging`, {
        params: Object.assign({
          tag: route.params.tag
        }, pageable)
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
        pageLoading: false,
        showGoTop: false
      }
    },
    watch: {
      /**
       * 如果直接用计算属性计算showGoTop的话，
       * 可能会导致渲染过度，导致页面卡顿
       */
      scrollTop(newVal, oldVal) {
        let threshold = 150;
        if (newVal > threshold && oldVal <= threshold) {
          this.showGoTop = true
        } else if (newVal <= threshold && oldVal > threshold) {
          this.showGoTop = false
        }
      }
    },
    computed: {
      scrollTop() {
        return this.$store.state.window.scrollTop
      }
    },
    mounted() {
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

  .go-top {
    position: fixed;
    bottom: 50px;
    right: 50px;
    color: @font-color;
  }
</style>
