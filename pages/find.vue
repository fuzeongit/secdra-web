<template>
  <div class="page">
    <div class="list-content" :style="{height:`${listContentOffset.height}px`}">
      <div class="item" :style="{left:`${offset[index].left}px`,top:`${offset[index].top}px`}"
           v-for="(draw,index) in list" :key="index">
        <nuxt-link :to="`/draw/${draw.id}`" class="img-box">
          <img :src="$img.scedra(draw.url,`specifiedWidth`)"
               :style="{width:listConstant.colWidth+`px`,height:getHeight(draw)+`px`}">
        </nuxt-link>
        <a class="icon s-heart like" :style="{color:draw.focus?`red`:`white`}"
           @click.stop="collection(draw,index)"></a>
        <div class="info-box">
          <div class="flex-row">
            <nuxt-link :to="`/user/${draw.userId}`">
              <img :src="$img.head(draw.user.head)" style="border-radius: 50%;width: 50px">
            </nuxt-link>
            <div class="col user-info">
              <p class="draw-name center">
                <nuxt-link :to="`/draw/${draw.id}`">
                  {{draw.name}}
                </nuxt-link>
              </p>
              <p class="user-name center">
                <nuxt-link :to="`/user/${draw.userId}`">
                  {{draw.user.name}}
                </nuxt-link>
              </p>
            </div>
            <div class="col follow-box" v-if="draw.user.focus !== null">
              <button class="btn" :class="{'is-plain':!draw.user.focus}" @click="follow(draw.user.id)">{{draw.user.focus?`已关注`:`关注`}}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="item last-card padding-10px" v-if="page.last"
           :style="{left:`${listContentOffset.lastCardLeft}px`,top:`${listContentOffset.lastCardTop}px`}">
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
        for(let draw of this.list){
          if(draw.user.id===id){
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
        @btn-width: 50px;
        height: @info-box-height;
        padding: 15px 15px;

        .flex-row {
          img {
            width: 50px;
            border-radius: 50%;
          }

          .user-info {
            padding: 0 10px;
            width: calc(100% - 50px - @btn-width);
            .draw-name {
              line-height: 20px;
              font-size: @default-font-size;
              font-weight: 600;
              .ellipsis()
            }
            .user-name {
              font-size: @small-font-size;
              line-height: 20px;
              color: @gray;
              .ellipsis();
            }
          }
          .follow-box {

            width: @btn-width;
            .btn {
              padding: 0;
              width: @btn-width;
              line-height: 25px;
            }
          }
        }
      }
    }
    .last-card {
      width: 250px;
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
