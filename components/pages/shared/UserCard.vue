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
          {{user.name}}
        </p>
        <p class="introduction" :title="user.introduction">
          {{user.introduction}}
        </p>
      </div>
    </div>
    <div class="padding-10" style="margin-top: -10px">
      <button class="btn block">关注</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["user"]
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin.less";

  @size: 300px;
  @img-size: 60px;
  .size{
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

    }
    .introduction {
      font-size: @small-font-size;
      margin-top: 10px;
      .ellipsis()
    }
  }
</style>
