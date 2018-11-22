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
          <nuxt-link :to="`/user/${user.id}`" class="head-box">
            {{user.name}}
          </nuxt-link>
        </p>
        <p class="introduction" :title="user.introduction">
          {{user.introduction}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['users']
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin.less";

</style>
