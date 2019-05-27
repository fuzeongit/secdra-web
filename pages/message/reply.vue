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
    <div class="not card" v-if="!list.length">
      <img src="../../assets/image/default/not.png">
    </div>
  </div>
</template>

<script>
  import config from "../../assets/script/config";

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      let type = "reply";
      store.commit('message/MChangeType', {type, reset: true});
      let {data: result} = await $axios.get(`${config.host}/message/list`, {
        params: {
          messageType: type.toUpperCase()
        }
      });
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      return {
        list: result.data
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
      box-shadow: none;
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
          color: @font-color-dark-fade;
        }
      }
    }
    .not {
      text-align: center;
      box-shadow: none;
    }
  }
</style>
