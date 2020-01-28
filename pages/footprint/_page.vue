<template>
  <div class="page">
    <div class="content">
      <div v-for="(picture, index) in list" :key="index" class="card ">
        <template
          v-if="
            picture.life === $enum.PictureLifeState.EXIST.key &&
              picture.privacy === $enum.PrivacyState.PUBLIC.key
          "
        >
          <nuxt-link
            v-ripple
            :to="`/picture/${picture.id}`"
            class="img-box flex-box"
          >
            <img
              :src="$img.secdra(picture.url, `specifiedWidth`)"
              :style="{
                height: getProportion(picture) >= 1 ? `100%` : `auto`,
                width: getProportion(picture) <= 1 ? `100%` : `auto`
              }"
            />
          </nuxt-link>
          <div class="tool">
            <Btn
              v-tooltip="
                picture.focus === $enum.CollectState.CONCERNED.key
                  ? `取消收藏`
                  : `收藏`
              "
              flat
              icon
              :color="
                picture.focus === $enum.CollectState.CONCERNED.key
                  ? `red`
                  : `default`
              "
              small
              @click.stop="collection(picture)"
            >
              <i
                class="icon"
                :class="{
                  'ali-icon-likefill':
                    picture.focus === $enum.CollectState.CONCERNED.key,
                  'ali-icon-like':
                    picture.focus !== $enum.CollectState.CONCERNED.key
                }"
              ></i>
            </Btn>
          </div>
          <div v-if="picture.user.id" class="flex-box info-box">
            <nuxt-link
              v-ripple
              :to="`/user/${picture.user.id}`"
              class="head-box"
            >
              <img :src="$img.head(picture.user.head, 'small50')" />
            </nuxt-link>
            <div class="user-info-box">
              <p class="nickname">
                {{ picture.user.name }}
              </p>
              <p class="introduction">
                {{ picture.user.introduction }}
              </p>
            </div>
            <div class="follow-box flex-box">
              <Btn
                block
                color="primary"
                :disabled="picture.user.focus === $enum.FollowState.SElF.key"
                @click="follow(picture.user.id)"
              >
                {{
                  picture.user.focus === $enum.FollowState.CONCERNED.key
                    ? `已关注`
                    : `关注`
                }}
              </Btn>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="img-box flex-box">
            <img
              src="../../assets/image/svg/default-picture.svg"
              class="cover"
              style="width: 100%;height: 100%"
            />
          </div>
          <div class="tool">
            <Btn
              flat
              icon
              :color="
                picture.focus === $enum.CollectState.CONCERNED.key
                  ? `primary`
                  : `default`
              "
              small
              @click.stop="collection(picture)"
            >
              <i
                class="icon"
                :class="{
                  'ali-icon-likefill':
                    picture.focus === $enum.CollectState.CONCERNED.key,
                  'ali-icon-like':
                    picture.focus !== $enum.CollectState.CONCERNED.key
                }"
              ></i>
            </Btn>
          </div>
          <div class="flex-box info-box">
            <div class="head-box">
              <img src="../../assets/image/svg/default-head.svg" />
            </div>
            <div class="user-info-box-empty">
              <p class="nickname"></p>
              <p class="introduction"></p>
            </div>
          </div>
        </template>
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
import { mapActions } from "vuex"
import { Pageable } from "../../assets/script/model"

export default {
  middleware: "auth",
  async asyncData({ store, route, $axios }) {
    store.commit("menu/MChangeName", "footprint")
    const pageable = new Pageable(
      route.params.page * 1 || 0,
      16,
      "createDate,desc"
    )
    const { data: result } = await $axios.get(`/footprint/paging`, {
      params: Object.assign(
        {
          targetId: store.state.user.user.id
        },
        pageable
      )
    })
    return {
      pageable,
      page: result.data,
      list: result.data.content
    }
  },
  head() {
    return { title: "我的足迹 - Secdra" }
  },
  methods: {
    ...mapActions("picture", ["ACollection"]),
    ...mapActions("user", ["AFollow"]),
    getProportion(picture) {
      return picture.height / picture.width
    },
    paging(page) {
      this.$router.push(`/footprint/${page}`)
    },
    async collection(picture) {
      const result = await this.ACollection({
        pictureId: picture.id
      })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      picture.focus = result.data
    },
    async follow(id) {
      const result = await this.AFollow({
        followingId: id
      })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.list.forEach((item) => {
        if (item.user.id === id) {
          item.user.focus = result.data
        }
      })
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../assets/style/color";
@import "../../assets/style/config";
@import "../../assets/style/mixin";
@info-box-height: 80px;

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

    &:hover {
      transform: translateY(-1px);

      .info-box {
        .user-info-box {
          opacity: 0;
          transform: translateY(10px);
        }

        .follow-box {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }

    .img-box {
      width: @size;
      height: @size;
    }

    .tool {
      margin: 10px;
      user-select: none;
      padding: 0 10px;
      text-align: right;

      .like {
        vertical-align: middle;
        margin-left: 10px;
      }
    }

    .info-box {
      @img-size: 50px;
      @padding-size: 15px;
      padding: 0 @padding-size @padding-size;
      overflow: hidden;

      .head-box {
        display: block;
        position: relative;
        transition: @default-animate-time;
        border-radius: 50%;

        img {
          border-radius: 50%;
          width: @img-size;
        }
      }

      .user-info-box {
        width: calc(100% - @img-size);
        padding: 0 20px;
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

      .user-info-box-empty {
        .user-info-box();
        user-select: none;

        .nickname {
          &:before {
            padding: 0 40px;
            background-color: @font-color-dark-line;
            content: "\20";
          }
        }

        .introduction {
          &:before {
            padding: 0 60px;
            background-color: @font-color-dark-line;
            content: "\20";
          }
        }
      }

      .follow-box {
        position: absolute;
        height: @info-box-height;
        bottom: 0;
        width: calc(100% - @img-size - @padding-size);
        right: 0;
        padding: 15px;
        transition: @default-animate-time;
        opacity: 0;
        transform: translateY(10px);
      }
    }
  }
}
</style>
<style type="text/less" lang="less" module>
@import "../../assets/style/color";

.primary-color {
  color: @theme-color;
}
</style>
