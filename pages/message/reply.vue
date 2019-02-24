<template>
  <div class="list">
    <div class="item card" v-for="item in list" :key="item.id">
      <div class="row">
        <div class="col-3 head">
          <nuxt-link :to="`/user/${item.answerer.id}`">
            <img :src="$img.head(item.answerer.head,'small50')">
          </nuxt-link>
        </div>
        <div class="col-27 desc">
          <p class="name">
            <nuxt-link :to="`/user/${item.answerer.id}`">
              {{item.answerer.name}}
            </nuxt-link>
            <span>回复了我的</span>
            <nuxt-link :to="`/draw/${item.drawId}`">
              评论
            </nuxt-link>
          </p>
          <p class="time">{{item.createDate}}</p>
          <p class="content">
            {{item.content}}
          </p>
        </div>
      </div>
    </div>
    <div class="not card" v-if="!loading && !list.length">
      <img src="../../assets/image/default/not.png">
    </div>
  </div>
</template>

<script>
  import {mapActions} from "vuex"

  export default {
    data() {
      return {
        type: "reply",
        loading: true,
        list: []
      }
    },
    mounted() {
      this.$parent.type = this.type;
      this.getList()
    },
    methods: {
      ...mapActions("message", ["AList"]),
      async getList() {
        this.loading = true;
        let result = await this.AList({messageType: this.type.toUpperCase()});
        this.loading = false;
        if (result.status !== 200) {
          this.$notify({message: result.message});
        }
        this.list = result.data;
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";

  .list {
    height: 100%;
    overflow: scroll;
    .item {
      margin-top: 10px;
      padding: 20px 30px;
      text-align: left;
      &:first-child {
        margin-top: 0;
      }
      .head {
        img {
          border-radius: 50%;
        }
      }
      .desc {
        line-height: 25px;
        .name {
          a {
            font-weight: bold;
            color: @theme-color;
          }
        }
        .time {
          color: darken(@font-color, -30%);
        }
        .tool {
          user-select: none;
          a {
            user-select: none;
            width: 100px;
            display: inline-block;
            color: @theme-color;
            font-size: @default-font-size;
            margin-right: 15px;
            i {
              display: inline-block;
              color: @theme-color;
              margin-right: 3px;
            }
          }
        }
      }
    }
    .not {
      text-align: center;
    }
  }
</style>
