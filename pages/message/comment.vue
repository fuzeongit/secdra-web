<template>
  <div class="list">
    <Delay
      v-for="(item, index) in list"
      :key="item.id"
      :animation-delay="index * 0.05"
      class="item card"
    >
      <div class="row">
        <div class="col-3">
          <nuxt-link v-ripple :to="`/user/${item.critic.id}`" class="head-box">
            <img :src="$img.head(item.critic.head, 'small50')" />
          </nuxt-link>
        </div>
        <div class="col-27 desc">
          <p class="name">
            <nuxt-link :to="`/user/${item.critic.id}`" class="primary-hover">
              {{ item.critic.name }}
            </nuxt-link>
            <span>评论了我的</span>
            <nuxt-link :to="`/draw/${item.drawId}`" class="primary-hover">
              作品
            </nuxt-link>
          </p>
          <p class="time">{{ item.createDate | ago }}</p>
          <p class="content">
            {{ item.content }}
          </p>
        </div>
      </div>
    </Delay>
    <div v-if="!list.length" class="not card">
      <img src="../../assets/image/default/not.png" />
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ store, $axios }) {
    const type = "comment"
    store.commit("message/MChangeType", { type, reset: true })
    const { data: result } = await $axios.get(`/message/list`, {
      params: {
        messageType: type.toUpperCase()
      }
    })
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
    .head-box {
      display: inline-block;
      border-radius: 50%;
      img {
        @size: 50px;
        width: @size;
        height: @size;
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
