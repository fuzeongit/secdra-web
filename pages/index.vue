<template>
  <div class="page">
    <div class="content row">
      <div class="left-box">
        <div class="card image-card ">
          <h3 class="title">
            发现
            <nuxt-link to="/find">
              更多>>
            </nuxt-link>
          </h3>
          <div class="row">
            <div v-for="(draw,index) in likeList" class="item" :key="index">
              <div class="img-box">
                <nuxt-link :to="`/draw/${draw.id}`" class="cover"
                           :style="{backgroundImage: `url(${$img.scedra(draw.url,'specifiedWidth')})`}"
                           style="width: 100%">
                </nuxt-link>
                <a class="icon s-heart like" :style="{color:draw.focus?`red`:`white`}"
                   @click.stop="focus(index,`like`)"></a>
              </div>
              <p class="draw-name center">
                <nuxt-link :to="`/user/${draw.userId}`">
                  {{draw.name}}
                </nuxt-link>
              </p>
              <p class="user-name center">
                {{draw.user.name}}
              </p>
            </div>
          </div>
        </div>
        <div class="card image-card " style="margin-top: 20px;">
          <h3 class="title">
            最新
            <nuxt-link to="/new">
              更多>>
            </nuxt-link>
          </h3>
          <div class="row">
            <div v-for="(draw,index) in newList" class="item" :key="index">
              <div class="img-box">
                <nuxt-link :to="`/draw/${draw.id}`" class="cover"
                           :style="{backgroundImage: `url(${$img.scedra(draw.url,'specifiedWidth')})`}"
                           style="width: 100%">
                </nuxt-link>
                <a class="icon s-heart like" :style="{color:draw.focus?`red`:`white`}"
                   @click.stop="focus(index,`new`)"></a>
              </div>
              <p class="draw-name center">
                <nuxt-link :to="`/user/${draw.userId}`">
                  {{draw.name}}
                </nuxt-link>
              </p>
              <p class="user-name center">
                {{draw.user.name}}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="right-box">
        <div class="card tag-card">
          <h3 class="title">
            推荐标签
            <nuxt-link to="/">
              更多>>
            </nuxt-link>
          </h3>
          <div class="tag-list">
            <nuxt-link class="btn is-plain" v-for="(tag,index) in tagList" :to="`/draw/search/${tag.name}`"
                       :key="index"> {{tag.name}}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import config from "../assets/js/config";
  import {Pageable} from "../assets/js/model/base";

  export default {
    //在这里不能使用httpUtil
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "home";
      let taskList = [];
      taskList.push($axios.get(`${config.host}/tag/listTagOrderByLikeAmount`));
      taskList.push($axios.get(`${config.host}/draw/pagingByRecommend`, {params: new Pageable(0, 10)}));
      taskList.push($axios.get(`${config.host}/draw/paging`, {params: new Pageable(0, 10, "createDate,desc")}));
      let resultList = (await Promise.all(taskList)).map(item => item.data);
      return {
        tagList: resultList[0].data,
        likeList: resultList[1].data.content,
        newList: resultList[2].data.content,
      }
    },
    data() {
    },
    computed: {
      user() {
        return this.$store.state.user.user || {}
      }
    },
    mounted() {
    },
    methods: {
      focus(index, type) {
        if (type === `like`) {
          this.likeList[index].focus = !this.likeList[index].focus
        } else if (type === `new`) {
          this.newList[index].focus = !this.newList[index].focus
        }
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";

  .page {
    padding: 24px 0;
  }

  .content {
    width: @visual-width;
    margin: 0 auto;

    .card {
      .title {
        font-size: @medium-font-size;
        padding-left: 10px;
        line-height: @medium-font-size;
        border-left: 5px solid @theme-color;
        a {
          line-height: 16px;
          vertical-align: baseline;
          display: inline-block;
          float: right;
          color: @theme-color
        }
      }
    }
    .left-box {
      width: 850px;
      float: left;
      .image-card {
        padding: 10px 9px;
        .row {
          margin-top: 8px;
          .item {
            margin: 12px 8px;
            float: left;
            .img-box {
              position: relative;
              width: 150px;
              height: 150px;
              .cover {
                display: block;
                width: 100%;
                height: 100%;
              }
              .like {
                position: absolute;
                right: 8px;
                bottom: 8px;
                font-size: 20px
              }
            }
            .draw-name {
              margin-top: 10px;
              font-size: @default-font-size;
              font-weight: 600;
              .ellipsis()
            }
            .user-name {
              font-size: @small-font-size;
              line-height: 20px;
              color: @gray;
              .ellipsis()
            }
          }
        }
      }
    }
    .right-box {
      width: 250px;
      float: right;
      .tag-card {
        @spacing: 10px;
        padding: @spacing;

        .tag-list {
          margin-top: @spacing * 2;
          margin-bottom: -@spacing;
          .btn {
            margin-right: @spacing;
            margin-bottom: @spacing;
            line-height: 25px;
            padding: 0 2em;
          }
        }
      }
    }
  }
</style>
