<template>
  <div>
    <div class="size">
      <nuxt-link :to="`/draw/search/${tag}`" class="cover" v-if="draw"
                 :style="{backgroundImage: `url(${$img.scedra(draw.url,`specifiedWidth`)})`}">
      </nuxt-link>
    </div>
    <p class="tag-name">
      <nuxt-link :to="`/draw/search/${tag}`">{{tag}}</nuxt-link>
    </p>
  </div>
</template>

<script>
  import {mapActions} from "vuex"

  export default {
    props: ["tag"],
    data() {
      return {
        draw: null,
        loading: false,
      }
    },
    mounted() {
    },
    methods: {
      ...mapActions("draw", ["AGetFirstByTag"]),
      async load() {
        if (this.loading) {
          return
        }
        this.loading = true;
        let result = await this.AGetFirstByTag({tag: this.tag});
        this.loading = false;
        if (result.status !== 200) {
          throw new Error(result.message)
        }
        this.draw = result.data;
        console.log(this.draw);
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin.less";

  @size: 250px;
  .size {
    width: @size;
    height: @size /1.5;
    background-color: @border-color;
    .cover {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .tag-name {
    .center();
    .ellipsis();
    font-size: @default-font-size;
    padding: 8px;
  }
</style>
