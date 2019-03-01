<template>
  <div class="card settings-box">
    <p><strong>消息通知开关</strong></p>
    <div class="row">
      <div class="col-10">评论我的</div>
      <div class="col-20">
        <SSwitch v-model="settingsForm.commentStatus"></SSwitch>
      </div>
    </div>
    <div class="row">
      <div class="col-10">回复我的</div>
      <div class="col-20">
        <SSwitch v-model="settingsForm.replyStatus"></SSwitch>
      </div>
    </div>

    <div class="row">
      <div class="col-10">关注我的</div>
      <div class="col-20">
        <SSwitch v-model="settingsForm.followStatus"></SSwitch>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapActions} from "vuex"
  import config from "../../assets/js/config";

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.message.type = "settings";
      let {data: result} = await $axios.get(`${config.host}/message/getSettings`);
      let settingsForm = {
        id: result.data.id,
        commentStatus: result.data.commentStatus,
        followStatus: result.data.followStatus,
        replyStatus: result.data.replyStatus,
      };
      return {
        settingsForm
      }
    },
    watch: {
      settingsForm: {
        handler(val) {
          this.saveSetting(val);
        },
        deep: true
      }
    },
    methods: {
      ...mapActions("message", ["ASaveSetting"]),
      async saveSetting(val) {
        await this.ASaveSetting(val)
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";

  .settings-box {
    text-align: left;
    padding: 10px 30px;
    line-height: 35px;
    .row {
      width: 400px;
    }
  }
</style>
