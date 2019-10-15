<template>
  <div class="page">
    <CheckboxGroup v-model="selectList" class="content">
      <div v-for="(draw, index) in list" :key="index" class="card ">
        <template
          v-if="
            draw.life === $enum.DrawLifeState.EXIST.key &&
              draw.privacy === $enum.PrivacyState.PUBLIC.key
          "
        >
          <nuxt-link v-ripple :to="`/draw/${draw.id}`" class="img-box flex-box">
            <img
              :src="$img.secdra(draw.url, `specifiedWidth`)"
              :style="{
                height: getProportion(draw) >= 1 ? `100%` : `auto`,
                width: getProportion(draw) <= 1 ? `100%` : `auto`
              }"
            />
          </nuxt-link>
          <div class="tool">
            <Btn
              v-tooltip="
                draw.focus === $enum.CollectState.CONCERNED.key
                  ? `取消收藏`
                  : `收藏`
              "
              flat
              icon
              :color="
                draw.focus === $enum.CollectState.CONCERNED.key
                  ? `red`
                  : `default`
              "
              small
              @click.stop="collection(draw)"
            >
              <i
                class="icon"
                :class="{
                  'ali-icon-likefill':
                    draw.focus === $enum.CollectState.CONCERNED.key,
                  'ali-icon-like':
                    draw.focus !== $enum.CollectState.CONCERNED.key
                }"
              ></i>
            </Btn>
          </div>
          <div v-if="draw.user.id" class="flex-box info-box">
            <nuxt-link v-ripple :to="`/user/${draw.user.id}`" class="head-box">
              <img :src="$img.head(draw.user.head, 'small50')" />
            </nuxt-link>
            <div class="user-info-box">
              <p class="nickname">
                {{ draw.user.name }}
              </p>
              <p class="introduction">
                {{ draw.user.introduction }}
              </p>
            </div>
            <div class="follow-box flex-box">
              <Btn
                block
                color="primary"
                :disabled="draw.user.focus === $enum.FollowState.SElF.key"
                @click="follow(draw.user.id)"
              >
                {{
                  draw.user.focus === $enum.FollowState.CONCERNED.key
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
              src="../../../assets/image/svg/default-draw.svg"
              class="cover"
              style="width: 100%;height: 100%"
            />
          </div>
          <div class="tool">
            <Btn
              v-tooltip="
                draw.focus === $enum.CollectState.CONCERNED.key
                  ? `取消收藏`
                  : `收藏`
              "
              flat
              icon
              :color="
                draw.focus === $enum.CollectState.CONCERNED.key
                  ? `red`
                  : `default`
              "
              small
              @click.stop="collection(draw)"
            >
              <i
                class="icon"
                :class="{
                  'ali-icon-likefill':
                    draw.focus === $enum.CollectState.CONCERNED.key,
                  'ali-icon-like':
                    draw.focus !== $enum.CollectState.CONCERNED.key
                }"
              ></i>
            </Btn>
          </div>
          <div class="flex-box info-box">
            <div class="head-box">
              <img src="../../../assets/image/svg/default-head.svg" />
            </div>
            <div class="user-info-box-empty">
              <p class="nickname"></p>
              <p class="introduction"></p>
            </div>
          </div>
        </template>
      </div>
    </CheckboxGroup>
    <Pageable
      :total-page="page.totalPages"
      :curr-page="pageable.page"
      @go="paging"
    ></Pageable>
  </div>
</template>

<script>
import { mapActions } from "vuex"
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
      $axios.get(`/collection/paging`, {
        params: Object.assign(
          {
            targetId: route.params.userId || store.state.user.user.id
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
      store.commit("menu/MChangeName", "collection")
    } else {
      store.commit("menu/MChangeName", "")
    }
    return {
      user,
      pageable,
      page,
      list: page.content,
      selectList: []
    }
  },
  head() {
    const title = this.self ? "我收藏的插画" : this.user.name + "收藏的插画"
    return { title: title + " - Secdra" }
  },
  methods: {
    ...mapActions("draw", ["ACollection", "AUnCollection"]),
    ...mapActions("user", ["AFollow"]),
    getProportion(draw) {
      return draw.height / draw.width
    },
    paging(page) {
      this.$router.push(`/collection/${this.$route.params.userId}/${page}`)
    },
    async collection(draw) {
      const result = await this.ACollection({
        drawId: draw.id
      })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      draw.focus = result.data
    },
    unCollection() {
      this.$confirm({
        message: `你确定要取消选中的收藏吗？`,
        okCallback: async () => {
          const result = await this.AUnCollection({
            drawIdList: this.selectList.map((item) => item.id)
          })
          if (result.status !== 200) {
            this.$notify({ message: result.message })
            return
          }
          // eslint-disable-next-line no-unused-vars
          for (const id of result.data) {
            const draw = this.list.find((item) => item.id === id)
            if (!draw) {
              continue
            }
            draw.focus = this.$enum.CollectState.STRANGE.key
          }
          this.$notify({ message: `取消收藏成功` })
        }
      })
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
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

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
@import "../../../assets/style/color";

.primary-color {
  color: @theme-color;
}
</style>
