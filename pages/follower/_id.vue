<template>
  <div class="page">
      <div class="content row">
        <div class="card " v-for="(follower,index) in list" :key="index">
          <div class="cover"
               :style="{backgroundImage: `url(${$img.back(follower.background,`backCard`)})`}">
          </div>
          <div class="head-box center">
            <img :src="$img.head(follower.head)">
          </div>
          <div class="user-info-box center" >
            <p class="nickname">
              <nuxt-link :to="`/user/${follower.id}`" class="head-box">
                {{follower.name}}
              </nuxt-link>
            </p>
            <p class="introduction" :title="follower.introduction">
              {{follower.introduction}}
            </p>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import config from "../../assets/js/config";
  import {mapActions} from "vuex"
  import {Pageable} from "../../assets/js/model/base";

  export default {
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "follower";
      let pageable = new Pageable();
      pageable.size = 20;
      pageable.sort = "createDate,desc";
      let {data: result} = await $axios.get(`${config.host}/follower/paging`, {
        params: Object.assign({
          id: route.params.id
        }, pageable)
      });
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      return {
        page:result.data,
        list:result.data.content
      }
    },
    data() {
      return {}
    },
    components: {

    },
    computed: {
      scrollTop() {
        return this.$store.state.window.scrollTop || 0
      }
    },
    mounted() {

    },
    methods:{
      ...mapActions("user", ["APagingFollower"]),
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";

  .content {
    width: @visual-width;
    margin: 0 auto;
    .card{
      float: left;
      margin-top: 24px;
      margin-right: 24px;
      transition: 0.5s;
      @size:250px;
      width:@size;
      &:nth-child(4n+1){
        margin-left: 24px;
      }
      .cover {
        height: @size /2;
        width: @size
      }
      .head-box{
        padding: 10px;
        img{
          border-radius: 50%;
          width: 80px;
          border: 2px solid @white;
        }
      }
      .user-info-box{
        padding: 0 20px 20px 20px;
        .nickname{
          .ellipsis()
        }
        .introduction {
          font-size: @small-font-size;
          margin-top: 10px;
          .ellipsis()
        }
      }
      &:hover{
        transform: translateY(-1px);
        box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
      }
    }
  }
</style>
