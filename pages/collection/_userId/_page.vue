<template>
  <div class="page">
    <div class="content row">
      <div class="card" v-for="(draw,index) in list" :key="index">
        <img :src="$img.scedra(draw.url,`specifiedWidth`)">
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
      async paging(page) {
        this.$router.push(`/collection/${this.$route.params.userId}/${page}`);
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
      transition: @default-animate-time;
      overflow: hidden;
      width: @size;
      &:nth-child(4n+1) {
        margin-left: 24px;
      }
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
      }
    }
  }
</style>
