<template>
  <div class="page">
    <div class="list-content" :style="{height:`${listContentOffset.height}px`}">
      <div class="item" :style="{left:`${offset[index].left}px`,top:`${offset[index].top}px`}"
           v-for="(draw,index) in list" :key="index">
        <nuxt-link :to="`/draw/${draw.id}`" class="img-box">
          <img :src="$img.scedra(draw.url,`specifiedWidth`)"
               :style="{width:listConstant.colWidth+`px`,height:getHeight(draw)+`px`}">
        </nuxt-link>
        <a class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"
           :style="{color:draw.focus?`red`:`gray`}" title="收藏"
           @click.stop="collection(draw)"></a>
        <div class="flex-box info-box" :style="{width:listConstant.colWidth+`px`,height:listConstant.infoHeight+`px`}">
          <nuxt-link :to="`/user/${draw.user.id}`" class="head-box">
            <img :src="$img.head(draw.user.head)" :title="draw.user.name">
          </nuxt-link>
          <div class="user-info-box">
            <p class="nickname">
              {{draw.user.name}}
            </p>
            <p class="introduction" :title="draw.user.introduction">
              {{draw.user.introduction}}
            </p>
          </div>
          <div class="follow-box flex-box">
            <button class="btn block" @click="follow(draw.user.id)" :disabled="draw.user.focus===null">
              {{draw.user.focus?`已关注`:`关注`}}
            </button>
          </div>
        </div>
      </div>
      <div class="item last-card padding-10px" v-if="page.last"
           :style="{left:`${listContentOffset.lastCardLeft}px`,top:`${listContentOffset.lastCardTop}px`,width:listConstant.colWidth+`px`}">
        <img src="../assets/image/error/404.jpg">
      </div>
    </div>
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <button class="btn is-suspend" v-goTop style="position: fixed;right: 50px;bottom: 50px;" v-show="showGoTop">
        <i class="icon s-zhiding"></i></button>
    </transition>
  </div>
</template>

<script>
  import config from "../assets/js/config/index";
  import {Pageable} from "../assets/js/model/base";
  import {ListConstant} from "../assets/js/constant/base";
  import {mapActions} from "vuex"

  export default {
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "find";
      let pageable = new Pageable();
      pageable.size = 16;
      let {data: result} = await $axios.get(`${config.host}/draw/pagingByRecommend`, {
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
        inputPage: 1,
        pageLoading: false,
        listConstant: new ListConstant(),
        showGoTop: false
      }
    },
    watch: {
      scrollBottom: function (newVal) {
        if (this.pageLoading) {
          return
        }
        if (newVal > 300) {
          return
        }
        this.paging()
      },
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
      scrollBottom() {
        return this.$store.state.window.scrollBottom
      },
      scrollTop() {
        return this.$store.state.window.scrollTop
      },
      //计算偏移
      offset() {
        let o = [];
        let colNumberHeight = this.initColNumberHeight(this.listConstant);
        for (let draw of this.list) {
          let minTopIndex = colNumberHeight.minIndex();
          let left = (1 + minTopIndex) * this.listConstant.widthOffset + this.listConstant.colWidth * minTopIndex;
          let top = colNumberHeight[minTopIndex];
          colNumberHeight[minTopIndex] += (draw.height / draw.width) * (this.listConstant.colWidth) + this.listConstant.heightOffset + this.listConstant.infoHeight;
          o.push({left, top});
        }
        return o
      },
      //计算盒子属性
      listContentOffset() {
        let colNumberHeight = this.initColNumberHeight(this.listConstant);
        let minIndex = 0;
        for (let draw of this.list) {
          colNumberHeight[minIndex] += (draw.height / draw.width) * (this.listConstant.colWidth) + this.listConstant.heightOffset + this.listConstant.infoHeight;
          minIndex = colNumberHeight.minIndex()
        }
        let offset = {
          height: colNumberHeight.max()
        };
        if (this.page.last) {
          let lastCardHeight = 300;
          offset.lastCardLeft = (1 + minIndex) * this.listConstant.widthOffset + this.listConstant.colWidth * minIndex;
          offset.lastCardTop = colNumberHeight.min();
          let h = colNumberHeight.min() + lastCardHeight + this.listConstant.heightOffset;
          if (h > offset.height) {
            offset.height = h
          }
          return offset
        } else {
          return offset
        }

      }
    },
    mounted() {
      this.$notify({message: `现在暂时先随机出`, waitTime: 4000});
    },
    methods: {
      ...mapActions("draw", ["APagingByRecommend", "AListByRecommend", "ACollection"]),
      ...mapActions("user", ["AFollow"]),
      //初始化高度数组
      initColNumberHeight(listConstant) {
        let t = [];
        for (let i = 0; i < listConstant.colNumber; i++) {
          t[i] = listConstant.heightOffset
        }
        return t
      },
      getHeight(draw) {
        return (draw.height / draw.width) * (this.listConstant.colWidth)
      },
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
        let result = await this.APagingByRecommend(Object.assign({
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
      async listByRecommend(index) {
        let result = await this.AListByRecommend();
        result.data.reverse();
        for (let item of  result.data) {
          this.list.splice(index + 1, 0, item);
        }
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
        if (draw.focus) {
          this.listByRecommend(index)
        }
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
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";

  .list-content {
    width: @visual-width;
    margin: 0 auto;
    position: relative;
    height: 999px;
    .item {
      @info-box-height: 80px;
      position: absolute;
      transition: 0.5s;
      border-radius: @smallest-border-radius;
      background-color: @white;
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
        .info-box {
          .user-info-box {
            opacity: 0;
            transform: translateY(10px);
          }
          .follow-box {
            opacity: 1;
            transform: translateY(0);
          }
        }
      }
      .like {
        position: absolute;
        bottom: @info-box-height + 5px;
        right: 5px;
      }
      .img-box {
        img {
          transition: 0.5s;
          width: 100%
        }
      }
      .info-box {
        @img-size: 50px;
        @padding-size: 15px;
        padding: @padding-size;
        overflow: hidden;
        .head-box {
          display: block;
          position: relative;
          transition: @default-animate-time;
          img {
            border-radius: 50%;
            width: @img-size;
          }
        }

        .user-info-box {
          width: calc(100% - @img-size);
          padding: 0 30px;
          transition: @default-animate-time;
          .nickname {
            .ellipsis()
          }
          .introduction {
            font-size: @small-font-size;
            margin-top: 10px;
            .ellipsis()
          }
        }

        .follow-box {
          position: absolute;
          height: @info-box-height;
          bottom: 0;
          width: calc(100% - @img-size - @padding-size);
          right: 0;
          padding: 15px;
          transition: @default-animate-time;
          opacity: 0;
          transform: translateY(10px);
        }

      }
    }
    .last-card {
      height: 300px;
      img {
        width: 100%;
      }
    }
  }

  .next {
    position: fixed;
    bottom: 50px;
    right: 50px;
  }
</style>
