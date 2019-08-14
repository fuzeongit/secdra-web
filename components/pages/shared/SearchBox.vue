<template>
  <form class="search-box" @submit.prevent="search">
    <Field color="primary" placeholder="请输入标签搜索"
           v-model="tag" v-popover:history></Field>
    <Btn color="primary" class="btn" type="submit">搜&nbsp;&nbsp;&nbsp;&nbsp;索</Btn>
    <Popper ref="history" trigger="click" @show="showHistory" @hide="hideHistory" clickReferenceKeep>
      <ul class="history-box">
        <li v-for="(item,index) in searchHistoryReverse" :class="{active:index===searchHistoryIndex}" :key="index"
            v-if="index<historyThreshold">
          <nuxt-link :to="`/draw/search/${encodeURIComponent(item)}`">
            {{item}}
          </nuxt-link>
        </li>
      </ul>
    </Popper>
  </form>
</template>

<script>
  import storageUtil from "../../../assets/script/util/storageUtil";
  import {off, on} from "../../../assets/script/util/domUtil";

  export default {
    props: {
      historyThreshold: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        tag: '',
        searchHistory: [],
        searchHistoryIndex: -1
      }
    },
    computed: {
      searchHistoryReverse() {
        return this.searchHistory.reverse()
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.searchHistory = storageUtil.localGet("searchHistory", []);
      });
    },
    methods: {
      async search() {
        if (this.tag) {
          let searchHistorySet = new Set(this.searchHistory);
          searchHistorySet.delete(this.tag);
          searchHistorySet.add(this.tag);
          this.searchHistory = storageUtil.localSet("searchHistory", [...searchHistorySet]);
        }
        this.$router.push(`/draw/search/${encodeURIComponent(this.tag)}`)
      },
      onKey(event) {
        if (event.keyCode !== 38 && event.keyCode !== 40) return;
        if (event.keyCode === 38) {
          this.searchHistoryIndex <= 0 ? this.searchHistoryIndex = this.searchHistory.length - 1 : this.searchHistoryIndex--
        }
        else if (event.keyCode === 40) {
          this.searchHistoryIndex >= this.searchHistory.length - 1 ? this.searchHistoryIndex = 0 : this.searchHistoryIndex++
        }
        this.tag = this.searchHistory[this.searchHistoryIndex]
      },
      showHistory() {
        on(document, "keydown", this.onKey);
      },
      hideHistory() {
        off(document, "keydown", this.onKey);
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  @input-size: 350px;

  .search-box {
    font-size: 0;
    .input {
      width: @input-size;
      font-size: @small-font-size;
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      border-right: 0;
    }
    .btn {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
      font-size: @small-font-size;
    }
  }

  .history-box {
    width: @input-size;
    li {
      line-height: 35px;
      padding: 0 15px;
      &.active, &:hover {
        background-color: @font-color-dark-line;
      }
      a {
        display: block;
      }
    }
  }
</style>
