<template>
  <div class="list-content" :style="{height:`${listContentOffset.height}px`}">
    <div class="item" :style="{left:`${offset[index].left}px`,top:`${offset[index].top}px`}"
         v-for="(draw,index) in list" :key="index">
      <nuxt-link :to="`/draw/${draw.id}`" class="img-box">
        <img :src="$img.secdra(draw.url,`specifiedWidth`)"
             :style="{width:listConstant.colWidth+`px`,height:getHeight(draw)+`px`}">
      </nuxt-link>
      <a class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"
         :style="{color:draw.focus?`red`:`gray`}" title="收藏"
         @click.stop="$emit(`collection`,draw,index)"></a>
      <div class="flex-box info-box" :style="{width:listConstant.colWidth+`px`,height:listConstant.infoHeight+`px`}">
        <nuxt-link :to="`/user/${draw.user.id}`" class="head-box">
          <img :src="$img.head(draw.user.head,'small50')" :title="draw.user.name">
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
          <button class="btn block" @click="$emit(`follow`,draw.user.id)" :disabled="draw.user.focus===null">
            {{draw.user.focus?`已关注`:`关注`}}
          </button>
        </div>
      </div>
    </div>
    <div class="item last-card" v-if="page.last"
         :style="{left:`${listContentOffset.lastCardLeft}px`,top:`${listContentOffset.lastCardTop}px`,width:listConstant.colWidth+`px`}">
      <img src="../../../assets/image/error/404.jpg">
    </div>
  </div>
</template>

<script>
  import {ListConstant} from "../../../assets/script/constant/base";
  import {mapState} from 'vuex'

  export default {
    componentName: "DrawList",
    props: {
      page: Object,
      list: {
        type: Array,
        default: [],
      },
      pageLoading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        listConstant: new ListConstant(),
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
        this.$emit("paging");
      },
    },
    computed: {
      ...mapState('window', ['scrollTop', 'scrollBottom']),
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
    methods: {
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
    }
  }
</script>


<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin";

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
            font-size: @smallest-font-size;
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

</style>
