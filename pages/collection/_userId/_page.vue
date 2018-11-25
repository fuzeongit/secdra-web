<template>
  <div class="page">
    <div class="content row">
      <div class="card " v-for="(draw,index) in list" :key="index">
        <nuxt-link :to="`/draw/${draw.id}`" class="img-box flex-box">
          <img :src="$img.scedra(draw.url,`specifiedWidth`)"
               :style="{height:getProportion(draw)>1?`100%`:`auto`,width:getProportion(draw)<1?`100%`:`auto`}">
        </nuxt-link>
        <a class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"
           :style="{color:draw.focus?`red`:`gray`}" title="收藏"
           @click.stop="collection(draw)"></a>
      </div>
    </div>
    <br>
    <Pageable :totalPage="page.totalPages" :currPage="pageable.page" @go="paging"></Pageable>
  </div>
</template>

<script>
  import PageableCom from '../../../components/global/Pageable'
  import config from "../../../assets/js/config";
  import {Pageable} from "../../../assets/js/model/base";
  import {mapActions} from "vuex"

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "collection";
      let pageable = new Pageable();
      pageable.size = 8;
      pageable.page = route.params.page * 1 || 0;
      pageable.sort = "createDate,desc";
      let {data: result} = await $axios.get(`${config.host}/collection/paging`, {
        params: Object.assign({
          id: route.params.userId
        }, pageable)
      });
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      return {
        pageable,
        page: result.data,
        list: result.data.content
      }
    },
    components: {
      Pageable: PageableCom
    },
    methods: {
      ...mapActions("draw", ["ACollection"]),
      ...mapActions("user", ["AFollow"]),
      getProportion(draw) {
        return draw.height / draw.width
      },
      paging(page) {
        this.$router.push(`/collection/${this.$route.params.userId}/${page}`);
      },
      async collection(draw, index) {
        let result = await this.ACollection({
          drawId: draw.id
        });
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        draw.focus = result.data;
      },
      async follow(id) {
        let result = await this.AFollow({
          followerId: id
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
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .content {
    width: @visual-width;
    margin: 0 auto;
    .card {
      @size: 250px;
      float: left;
      margin-top: 24px;
      margin-right: 24px;
      overflow: hidden;
      transition: @default-animate-time;
      width: @size;
      height: @size;
      position: relative;
      &:nth-child(4n+1) {
        margin-left: 24px;
      }
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
      }
      .img-box {
        width: 100%;
        height: 100%;
      }
      .like {
        position: absolute;
        bottom: 5px;
        right: 5px;
      }
    }
  }
</style>
