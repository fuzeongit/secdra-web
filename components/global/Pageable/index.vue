<template>
  <div class="pageable-content center" v-show="!(isFirst&&isLast)">
    <a v-show="!isFirst" @click="go(currPage)">
      上一页
    </a>
    <template v-for="(i,index) in showPageBtn">
      <a v-if="i" :key="index" @click="go(i)" :style="{color:i-1===currPage?`#AAA`:`#000`}">{{i}}</a>
      <span v-else :key="index">···</span>
    </template>
    <a v-show="!isLast" @click="go(currPage+2)">
      下一页
    </a>
  </div>
</template>

<script>
  export default {
    props: {
      totalPage: {
        type: Number,
        required: true
      },
      currPage: {
        type: Number,
        required: true
      }
    },
    computed: {
      isFirst() {
        return this.currPage === 0;
      },
      isLast() {
        return this.currPage === this.totalPage - 1
      },
      showPageBtn() {
        let totalPage = this.totalPage,
          currPage = this.currPage + 1,
          threshold = 7,
          arr = [];
        if (totalPage <= threshold) {
          for (let i = 1; i <= totalPage; i++) {
            arr.push(i)
          }
        } else {
          if (currPage <= 4) return [1, 2, 3, 4, 0, totalPage - 1, totalPage];
          if (currPage >= totalPage - 3) return [1, 2, 0, totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
          return [1, 0, currPage - 1, currPage, currPage + 1, 0, totalPage];
        }

        return arr
      }
    },
    methods: {
      go(page) {
        if (page - 1 === this.currPage) {
          return
        }
        this.$emit("go", page - 1)
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";

  .pageable-content {
    margin-bottom: 10px;
    font-weight: 500;
    a,span {
      display: inline-block;
      padding: 0 10px;
    }
  }
</style>
