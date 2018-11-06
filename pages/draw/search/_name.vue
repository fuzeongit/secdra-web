<template>
  <div class="page">
    <div class="list-content" :style="{height:`${listHeight}px`}">
      <div class="item"
           :style="{left:`${getOffset(draw).left}px`,top:`${getOffset(draw,true).top}px`,width:listConstant.colWidth+`px`}"
           v-for="(draw,index) in page.content" >
        <img :src="$img.scedra(draw.url,`specifiedWidth`)" style="width: 100%">
      </div>
    </div>
    <button class="btn" @click="click">测试</button>
  </div>
</template>

<script>
  import config from "../../../assets/js/config/index";
  import {Pageable} from "../../../assets/js/model/base";

  export default {
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "tag";
      let pageable = new Pageable();
      pageable.size = 40;
      pageable.sort = "likeAmount,desc";
      let {data: result} = await $axios.get(`${config.host}/draw/pagingByTag`, {
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
      let listConstant = {
        colNumber: 4,
        colWidth: 250,
        widthOffset: 24,
        heightOffset: 24
      };
      let colNumberHeight = function(){
        let t = [];
        for (let i = 0; i < listConstant.colNumber; i++) {
          t[i] = listConstant.heightOffset
        }
        return t
      }();
      return {
        pageLoading: false,
        listConstant,
        colNumberHeight
      }
    },
    watch:{
    },
    computed: {
      listHeight(){
        let listConstant = {
          colNumber: 4,
          colWidth: 250,
          widthOffset: 24,
          heightOffset: 24
        };
        let colNumberHeight = function(){
          let t = [];
          for (let i = 0; i < listConstant.colNumber; i++) {
            t[i] = listConstant.heightOffset
          }
          return t
        }();
        let minIndex = this.colNumberHeight.minIndex();
        for(let draw of this.list){
          colNumberHeight[minIndex] += (draw.height / draw.width) * (listConstant.colWidth) + listConstant.heightOffset;
          minIndex = colNumberHeight.minIndex()
        }
        return colNumberHeight.max()
      }
    },
    mounted() {
    },
    methods: {
      getOffset(draw,isGetMin) {
        let minIndex = this.colNumberHeight.minIndex();
        let left = (1 + minIndex) * this.listConstant.widthOffset + this.listConstant.colWidth * minIndex;
        let offset = {
          left,
          top: this.colNumberHeight[minIndex]
        };
        if(isGetMin){
          this.colNumberHeight[minIndex] += (draw.height / draw.width) * (this.listConstant.colWidth) + this.listConstant.heightOffset;
        }
        return offset
      },
      click(){
        console.log(this.list)
        console.log(this.list.concat(this.list))
        this.list = this.list.concat(this.list)
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";

  .list-content {
    width: @visual-width;
    margin: 0 auto;
    position: relative;
    height: 999px;
    .item {
      position: absolute;
      text-align: center;
      transition: 0.5s;
    }
  }
</style>
