<template>
  <div class="page">
    <div class="list-content" :style="{height:`${listHeight}px`}">
      <a class="item"
         :style="{left:`${getOffset(draw).left}px`,top:`${getOffset(draw,true).top}px`}"
         v-for="(draw,index) in list" :key="index">
        <img :src="$img.scedra(draw.url,`specifiedWidth`)"
             :style="{width:listConstant.colWidth+`px`,height:getHeight(draw)+`px`}">
      </a>
    </div>
    <button class="btn is-plain next" @click="paging" :disabled="page.last">换</button>
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
      pageable.size = 20;
      let {data: result} = await $axios.get(`${config.host}/draw/pagingByRecommend`, {
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
        pageLoading: false,
        listConstant,
        colNumberHeight
      }
    },
    watch: {},
    computed: {
      /**
       * @return {string}
       */
      randomColor() {
        let r, g, b;
        r = Math.floor(Math.random() * 256);
        g = Math.floor(Math.random() * 256);
        b = Math.floor(Math.random() * 256);
        return "rgb(" + r + ',' + g + ',' + b + ")";
      },
      //计算盒子高度
      listHeight() {
        let colNumberHeight = this.initColNumberHeight(this.listConstant);
        let minIndex = this.colNumberHeight.minIndex();
        for (let draw of this.list) {
          colNumberHeight[minIndex] += (draw.height / draw.width) * (this.listConstant.colWidth) + this.listConstant.heightOffset;
          minIndex = colNumberHeight.minIndex()
        }
        return colNumberHeight.max()
      }
    },
    mounted() {
      this.$message({message:"现在暂时先用着最多收藏的列表",waitTime:2000})
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
      getOffset(draw, isGetMin) {
        let minIndex = this.colNumberHeight.minIndex();
        let left = (1 + minIndex) * this.listConstant.widthOffset + this.listConstant.colWidth * minIndex;
        let offset = {
          left,
          top: this.colNumberHeight[minIndex]
        };
        if (isGetMin) {
          this.colNumberHeight[minIndex] += (draw.height / draw.width) * (this.listConstant.colWidth) + this.listConstant.heightOffset;
        }
        return offset
      },
      getHeight(draw) {
        return (draw.height / draw.width) * (this.listConstant.colWidth)
      },
      /**
       * 获取分页数据
       * @returns {Promise<void>}
       */
      async paging() {
        if (this.pageLoading) {
          return
        }
        this.pageable.page++;
        this.pageLoading = true;
        let result = await this.APaging(Object.assign({
            name: this.$route.params.name
          }, this.pageable)
        );
        this.pageLoading = false;
        if (result.status !== 200) {
          this.$alert({message: result.message});
          return
        }
        let data = result.data;
        this.colNumberHeight = this.initColNumberHeight(this.listConstant);
        this.page = data;
        this.list = data.content;
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";

  .list-content {
    width: @visual-width;
    margin: 0 auto;
    position: relative;
    height: 999px;
    .item {
      display: block;
      position: absolute;
      text-align: center;
      transition: 0.5s;
      img {
        transition: 0.5s;
        width: 100%
      }
    }
  }

  .next {
    position: fixed;
    bottom: 50px;
    right: 50px;
  }
</style>
