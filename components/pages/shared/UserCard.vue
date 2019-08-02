<template>
  <div class="size">
    <div class="cover"
         :style="{backgroundImage: `url(${$img.back(user.background,`backCard`)})`}">
    </div>
    <div class="flex-box" style="padding:10px">
      <nuxt-link :to="`/user/${user.id}`" class="head-box" v-ripple>
        <img :src="$img.head(user.head,'small50')">
      </nuxt-link>
      <div class="user-info-box">
        <p class="nickname">
          <nuxt-link :to="`/user/${user.id}`" class="primary-hover">{{user.name}}</nuxt-link>
        </p>
        <p class="introduction" :title="user.introduction">
          {{user.introduction}}
        </p>
      </div>
    </div>
    <div style="margin-top: -10px;padding: 10px;">
      <Btn block color="primary" @click="follow" :disabled="user.focus===$enum.FollowState.SElF.key">{{user.focus===$enum.FollowState.CONCERNED.key?`已关注`:`关注`}}</Btn>
    </div>
  </div>
</template>

<script>
  import {mapActions} from "vuex"

  export default {
    componentName: "UserCard",
    props: ["user"],
    methods: {
      ...mapActions("user", ["AFollow"]),
      async follow() {
        let result = await this.AFollow({
          followingId: this.user.id
        });
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.$emit("follow", {userId: this.user.id, focus: result.data})
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  @size: 300px;
  @img-size: 60px;
  .size {
    width: @size;
  }

  .cover {
    height: @size /2;
    width: @size;
    background-color: @theme-background-color;
  }

  .head-box {
    display: block;
    position: relative;
    border-radius: 50%;
    img {
      border-radius: 50%;
      width: @img-size;
    }
  }

  .user-info-box {
    width: calc(100% - @img-size);
    padding: 0 30px;

    .nickname {
      .ellipsis()
    }
    .introduction {
      font-size: @smallest-font-size;
      margin-top: 10px;
      .ellipsis()
    }
  }
</style>
