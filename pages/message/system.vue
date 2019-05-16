<template>
  <div class="list">
    <div class="item card" v-for="item in list" :key="item.id">
      <div class="row">
        <div class="col-30 desc">
          <p class="name">
            <span>{{item.title}}</span>
          </p>
          <p class="time">{{item.createDate}}</p>
          <div class="content" v-html="item.content">
          </div>
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
      let type = "system";
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
          font-weight: bold;
        }
        .time {
          color: @font-color-dark-fade;
        }
      }
    }
    .not {
      text-align: center;
    }
  }
</style>
