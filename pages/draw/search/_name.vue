<template>
  <div class="page">
    <div class="list-content" :style="{height:`${listHeight}px`}">
      <div class="item" :style="{left:`${offset[index].left}px`,top:`${offset[index].top}px`}"
           v-for="(draw,index) in list" :key="index">
        <nuxt-link :to="`/draw/${draw.id}`" class="img-box">
          <img :src="$img.scedra(draw.url,`specifiedWidth`)"
               :style="{width:listConstant.colWidth+`px`,height:getHeight(draw)+`px`}">
        </nuxt-link>
        <div class="info-box">
          <div class="flex-row">
            <img :src="$img.head(draw.user.head)" style="border-radius: 50%;width: 50px">
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
            <div class="col follow-box">
              <button class="btn is-plain">关注</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-popover:popover style="position: fixed;right: 50px;bottom: 50px;">
      <button class="btn is-suspend" style="color:#888" @click="paging"
              :disabled="page.last" >
        N
      </button>
    </div>

    <Popper ref="popover" trigger="hover" placement="left">
      <div class="padding-10">
        <div class="flex-row">
          <div class="col-15 center">
            第:<span style="vertical-align: baseline">{{page.number+1}}</span>页
          </div>
          <div class="col-15 center">
            共:<span style="vertical-align: baseline">{{page.totalPages}}</span>页
          </div>
        </div>
        <br>
        <form style="font-size: 0"  @submit.prevent="paging(inputPage)">
          <input type="number" title="" class="input" v-model="inputPage" style="border-bottom-right-radius: 0;border-top-right-radius: 0;border-right: 0">
          <button class="btn"  style="border-bottom-left-radius: 0;border-top-left-radius: 0;border-left: 0">跳转</button>
        </form>
      </div>
    </Popper>
  </div>
</template>

<script>
  import config from "../../../assets/js/config/index";
  import {Pageable} from "../../../assets/js/model/base";
  import {ListConstant} from "../../../assets/js/constant/base";
  import {mapActions} from "vuex"

  export default {
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "tag";
      let pageable = new Pageable();
      pageable.size = 20;
      pageable.sort = "likeAmount,desc";
      let {data: result} = await $axios.get(`${config.host}/draw/paging`, {
        params: Object.assign({
          name: route.params.name
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
      let listConstant = new ListConstant();
      let colNumberHeight = this.initColNumberHeight(listConstant);
      return {
        inputPage: 1,
        pageLoading: false,
        listConstant,
        colNumberHeight
      }
    },
    watch: {},
    computed: {
      scrollTop() {
        return this.$store.state.window.scrollTop
      },
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
      //计算盒子高度
      listHeight() {
        let colNumberHeight = this.initColNumberHeight(this.listConstant);
        let minIndex = 0;
        for (let draw of this.list) {
          colNumberHeight[minIndex] += (draw.height / draw.width) * (this.listConstant.colWidth) + this.listConstant.heightOffset + this.listConstant.infoHeight;
          minIndex = colNumberHeight.minIndex()
        }
        return colNumberHeight.max()
      }
    },
    mounted() {
    },
    methods: {
      ...mapActions("draw", ["APaging"]),
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
      async paging(triggerPage) {
        triggerPage = triggerPage * 1;
        if (this.pageLoading) {
          return
        }
        if (triggerPage === this.pageable.page) {
          return
        }
        let sourcePage = this.pageable.page;

        this.pageable.page = triggerPage ? triggerPage - 1 : this.pageable.page + 1;
        this.pageLoading = true;
        let result = await this.APaging(Object.assign({
            name: this.$route.params.name
          }, this.pageable)
        );
        this.pageLoading = false;
        let data = result.data;
        if (result.status !== 200) {
          this.$notify({message: result.message});
          this.pageable.page = sourcePage;
          return
        }
        if (data.content.isEmpty()) {
          this.$notify({message: `该页没有数据哦！`});
          this.pageable.page = sourcePage;
          return
        }
        this.colNumberHeight = this.initColNumberHeight(this.listConstant);
        this.page = data;
        this.list = data.content;
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .list-content {
    width: @visual-width;
    margin: 0 auto;
    position: relative;
    height: 999px;
    .item {
      position: absolute;
      transition: 0.5s;
      border-radius: @smallest-border-radius;
      background-color: @white;
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
      }
      .img-box {
        img {
          transition: 0.5s;
          width: 100%
        }
      }
      .info-box {
        @btn-width: 40px;
        height: 80px;
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
  }

  .next {
    position: fixed;
    bottom: 50px;
    right: 50px;
  }
</style>
