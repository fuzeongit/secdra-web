<template>
  <div class="page">
    <div class="content">
      <div v-for="(item, index) in list" :key="index" class="card">
        <div
          class="cover"
          :style="{
            backgroundImage: `url(${$img.back(item.background, `backCard`)})`
          }"
        ></div>
        <div style="text-align: center;padding:10px;">
          <nuxt-link v-ripple :to="`/user/${item.id}`" class="head-box center">
            <img :src="$img.head(item.head, 'small200')" />
          </nuxt-link>
        </div>
        <div class="user-info-box center ">
          <p class="nickname">
            {{ item.name }}
          </p>
          <p class="introduction">
            {{ item.introduction }}
          </p>
        </div>
      </div>
    </div>
    <Pageable
      :total-page="page.totalPages"
      :curr-page="pageable.page"
      @go="paging"
    ></Pageable>
  </div>
</template>

<script>
import { Pageable } from "../../../assets/script/model"

export default {
  // 在这里不能使用httpUtil
  // 并且嵌套层数超过不知道多少会报错-->坑死我了
  async asyncData({ store, redirect, route, $axios }) {
    store.commit("menu/MChangeName", "following")
    const pageable = new Pageable(
      route.params.page * 1 || 0,
      16,
      "createDate,desc"
    )
    const { data: result } = await $axios.get(`/following/paging`, {
      params: Object.assign(
        {
          id: route.params.userId
        },
        pageable
      )
    })
    if (result.status === 401) {
      redirect(`/login?r=${route.fullPath}`)
      return
    }
    return {
      pageable,
      page: result.data,
      list: result.data.content
    }
  },
  methods: {
    paging(page) {
      this.$router.push(`/following/${this.$route.params.userId}/${page}`)
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";
.page {
  padding: @page-gap 0;
}
.content {
  @column-number: 4;
  @gap: @page-gap;
  @size: (@visual-width - @gap * (@column-number + 1)) / @column-number;
  width: @visual-width;
  margin: 0 auto;
  padding: 0 @gap @gap;
  display: grid;
  grid-template-columns: repeat(@column-number, @size);
  grid-gap: @gap;
  .card {
    overflow: hidden;
    transition: @default-animate-time;
    position: relative;
    .cover {
      height: @size / 2;
      width: @size;
      transition: @default-animate-time;
    }
    .head-box {
      width: 80px;
      height: 80px;
      display: inline-block;
      border: 2px solid white;
      border-radius: 50%;
      transition: @default-animate-time;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .user-info-box {
      padding: 0 20px 20px 20px;
      transition: @default-animate-time;
      .nickname {
        .ellipsis();
      }
      .introduction {
        font-size: @smallest-font-size;
        margin-top: 10px;
        .ellipsis();
      }
    }
    &:hover {
      .cover {
        filter: blur(60px);
      }
      .head-box {
        transform: translateY(-25px) scale(2);
      }
      .user-info-box {
        opacity: 0;
        transform: translateY(25px);
      }
      transform: translateY(-1px);
    }
  }
}
</style>
