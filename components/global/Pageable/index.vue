<template>
  <div
    v-show="!((isFirst && isLast) || totalPage === 0)"
    class="pageable-content center"
  >
    <Btn
      v-show="!isFirst"
      round
      flat
      small
      color="primary"
      @click="go(currPage)"
    >
      上一页
    </Btn>
    <template v-for="(i, index) in showPageBtn">
      <Btn
        v-if="i"
        :key="index"
        round
        :flat="i - 1 !== currPage"
        small
        color="primary"
        class="page-btn"
        @click="go(i)"
      >
        {{ i }}
      </Btn>
      <span v-else :key="index">···</span>
    </template>
    <Btn
      v-show="!isLast"
      round
      flat
      small
      color="primary"
      @click="go(currPage + 2)"
    >
      下一页
    </Btn>
  </div>
</template>

<script>
export default {
  componentName: "Pageable",
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
      return this.currPage === 0
    },
    isLast() {
      return this.currPage === this.totalPage - 1
    },
    showPageBtn() {
      const totalPage = this.totalPage
      const currPage = this.currPage + 1
      const threshold = 7
      const arr = []
      if (totalPage <= threshold) {
        for (let i = 1; i <= totalPage; i++) {
          arr.push(i)
        }
      } else {
        if (currPage <= 4) return [1, 2, 3, 4, 0, totalPage - 1, totalPage]
        if (currPage >= totalPage - 3)
          return [
            1,
            2,
            0,
            totalPage - 3,
            totalPage - 2,
            totalPage - 1,
            totalPage
          ]
        return [1, 0, currPage - 1, currPage, currPage + 1, 0, totalPage]
      }

      return arr
    }
  },
  methods: {
    go(page) {
      if (page - 1 === this.currPage) {
        return
      }
      this.$emit("go", page)
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import "../../../assets/style/color";
@import "../../../assets/style/config";

.pageable-content {
  user-select: none;
  font-weight: 500;
  .page-btn {
    margin: 0 5px;
    padding: 0 1em;
  }
  span {
    display: inline-block;
    line-height: @small-input-line-height;
    padding: 0 10px;
  }
}
</style>
