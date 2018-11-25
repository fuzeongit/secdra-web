<template>
  <div class="size">
    <div class="cover"
         :style="{backgroundImage: `url(${$img.back(user.background,`backCard`)})`}">
    </div>
    <div class="flex-box padding-10">
      <nuxt-link :to="`/user/${user.id}`" class="head-box">
        <img :src="$img.head(user.head)">
      </nuxt-link>
      <div class="user-info-box">
        <p class="nickname">
          <nuxt-link :to="`/user/${user.id}`">
            {{user.name}}
          </nuxt-link>
        </p>
        <p class="introduction" :title="user.introduction">
          {{user.introduction}}
        </p>
      </div>
    </div>
    <div class="padding-10" style="margin-top: -10px">
      <button class="btn block" @click="follow" :disabled="user.focus===null">{{user.focus?`已关注`:`关注`}}</button>
    </div>
  </div>
</template>

<script>
  import {mapActions} from "vuex"

  export default {
    props: ["user"],
    methods: {
      ...mapActions("user", ["AFollow"]),
      async follow() {
        let result = await this.AFollow({
          followerId: this.user.id
        });
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.$emit("focus", {userId: this.user.id, focus: result.data})
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin.less";

  @size: 300px;
  @img-size: 60px;
  .size {
    width: @size;
  }

  .cover {
    height: @size /2;
    width: @size
  }

  .head-box {
    display: block;
    position: relative;
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
      font-size: @small-font-size;
      margin-top: 10px;
      .ellipsis()
    }
  }
</style>
