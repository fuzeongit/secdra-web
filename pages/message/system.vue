<template>
  <div class="list">
    <Delay
      v-for="(item, index) in list"
      :key="item.id"
      :animation-delay="index * 0.05"
      class="item card"
    >
      <div class="row">
        <div class="col-30 desc">
          <p class="name">
            <span>{{ item.title }}</span>
          </p>
          <p class="time">{{ item.createDate | ago }}</p>
          <div class="content" v-html="item.content"></div>
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
    const type = "system"
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
    box-shadow: none;
  }
}
</style>
