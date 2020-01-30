<template>
  <div class="page">
    <div class="content">
      <div v-for="(item, index) in list" :key="index" class="card">
        <div
          v-lazy:background-image="$img.backLazy(item.background, `backCard`)"
          class="cover"
        ></div>
        <div style="text-align: center;padding:10px;">
          <nuxt-link v-ripple :to="`/user/${item.id}`" class="head-box center">
            <img v-lazy="$img.headLazy(item.head, 'small200')" />
          </nuxt-link>
        </div>
        <div class="user-info-box center">
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
  computed: {
    self() {
      return (
        !this.$route.params.userId ||
        this.$store.state.user.user.id === this.$route.params.userId
      )
    }
  },
  // 在这里不能使用httpUtil
  // 并且嵌套层数超过不知道多少会报错-->坑死我了
  async asyncData({ store, redirect, route, $axios }) {
    const myself = store.state.user.user
    const taskList = []
    const pageable = new Pageable(
      route.params.page * 1 || 0,
      16,
      "createDate,desc"
    )
    taskList.push(
      $axios.get(`/user/get`, {
        params: { id: route.params.userId || myself.id }
      })
    )
    taskList.push(
      $axios.get(`/follower/paging`, {
        params: Object.assign(
          {
            id: route.params.userId
          },
          pageable
        )
      })
    )
    const resultList = (await Promise.all(taskList)).map((item) => item.data)
    if (resultList[0].status === 401) {
      redirect(`/login?r=${route.fullPath}`)
      return
    }
    const user = resultList[0].data
    const page = resultList[1].data
    if (myself.id === user.id) {
      store.commit("menu/MChangeName", "follower")
    } else {
      store.commit("menu/MChangeName", "")
    }
    return {
      user,
      pageable,
      page,
      list: page.content
    }
  },
  head() {
    const title = this.self ? "我的粉丝" : this.user.name + "的粉丝"
    return { title: title + " - Secdra" }
  },
  methods: {
    paging(page) {
      this.$router.push(`/follower/${this.user.id}/${page}`)
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
