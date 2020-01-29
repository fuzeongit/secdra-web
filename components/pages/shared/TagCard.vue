<template>
  <div>
    <div class="size">
      <nuxt-link
        v-if="picture"
        v-ripple
        :to="`/picture/search/${tag}`"
        class="cover"
        :style="{
          backgroundImage: `url(${$img.secdra(picture.url, `specifiedWidth`)})`
        }"
      >
      </nuxt-link>
    </div>
    <p class="tag-name">
      <Btn outline small round color="primary" :to="`/picture/search/${tag}`">
        {{ tag }}&nbsp;&nbsp;({{ amount }})
      </Btn>
    </p>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  componentName: "TagCard",
  props: {
    tag: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      picture: null,
      loading: false,
      amount: "--"
    }
  },
  mounted() {},
  methods: {
    ...mapActions("picture", ["AGetFirstByTag", "ACountByTag"]),
    async load() {
      if (this.loading) {
        return
      }
      this.loading = true
      let result = await this.AGetFirstByTag({ tag: this.tag })
      this.loading = false
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      this.picture = result.data

      result = await this.ACountByTag({ tag: this.tag })
      if (result.status === 200) {
        this.amount = result.data
      }
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

@size: 250px;
.size {
  width: @size;
  height: @size / 1.5;
  background-color: @theme-background-color;
  .cover {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.tag-name {
  width: @size;
  text-align: center;
  .ellipsis();
  font-size: @small-font-size;
  padding: 8px;
}
</style>
