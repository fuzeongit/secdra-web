<template>
  <div>
    <div
      class="user-bk cover"
      :style="{ backgroundImage: `url(${$img.back(user.background)})` }"
    >
      <div class="user-bk-content">
        <div class="tool">
          <Btn big round @click="$emit('follow')">
            <span style="min-width: 4em">
              {{
                user.focus === $enum.FollowState.CONCERNED.key
                  ? "已关注"
                  : "关注"
              }}</span
            >
          </Btn>
        </div>
      </div>
    </div>
    <div class="content card">
      <div class="head-box">
        <img
          :src="$img.head(user.head)"
          :onerror="
            `this.src='${require('../../../assets/image/svg/default-head.svg')}'`
          "
        />
        <div class="info-box">
          <p class="name">
            {{ user.name }}
            <i
              class="icon"
              :class="{
                'ali-icon-female': user.gender === $enum.Gender.FEMALE.key,
                'ali-icon-male': user.gender === $enum.Gender.MALE.key
              }"
            ></i>
          </p>
          <p class="introduction">
            {{ user.introduction || "这人很懒，什么都没有留下" }}
          </p>
        </div>
      </div>
      <div class="draw-box">
        <div v-loading="worksLoading" class="works-box">
          <h3 class="line center">
            <span
              >{{
                user.gender === $enum.Gender.FEMALE.key ? "她" : "他"
              }}的作品</span
            >
          </h3>
          <div class="draw-list row">
            <div
              v-for="(draw, index) in worksList"
              :key="index"
              class="draw-item"
            >
              <nuxt-link
                v-ripple
                style="width: 100%;height: 230px;"
                class="flex-box"
                :to="`/draw/${draw.id}`"
              >
                <img
                  :src="$img.secdra(draw.url, `specifiedWidth`)"
                  :style="{
                    height: getProportion(draw) >= 1 ? `100%` : `auto`,
                    width: getProportion(draw) <= 1 ? `100%` : `auto`
                  }"
                />
              </nuxt-link>
            </div>
          </div>
          <p v-if="worksList.length === 8" class="move">
            <Btn
              round
              flat
              small
              color="primary"
              :to="`/works/${user.id || ''}`"
              >查看更多>></Btn
            >
          </p>
          <img
            v-if="!worksLoading && !worksList.length"
            src="../../../assets/image/default/not.png"
            class="is-not"
          />
        </div>
        <div v-loading="collectionLoading" class="collection-box">
          <h3 class="line center">
            <span
              >{{
                user.gender === $enum.Gender.FEMALE.key ? "她" : "他"
              }}的收藏</span
            >
          </h3>
          <div class="draw-list row">
            <div
              v-for="(draw, index) in collectionList"
              :key="index"
              class="draw-item"
            >
              <nuxt-link
                v-ripple
                style="width: 100%;height: 230px;"
                class="flex-box"
                :to="`/draw/${draw.id}`"
              >
                <img
                  :src="$img.secdra(draw.url, `specifiedWidth`)"
                  :style="{
                    height: getProportion(draw) >= 1 ? `100%` : `auto`,
                    width: getProportion(draw) <= 1 ? `100%` : `auto`
                  }"
                />
              </nuxt-link>
            </div>
          </div>
          <p v-if="collectionList.length === 8" class="move">
            <Btn
              round
              flat
              small
              color="primary"
              :to="`/collection/${user.id || ''}`"
              >查看更多>></Btn
            >
          </p>
          <img
            v-if="!collectionLoading && !collectionList.length"
            src="../../../assets/image/default/not.png"
            class="is-not"
          />
        </div>
        <div v-loading="followingLoading" class="following-box">
          <h3 class="line center">
            <span
              >{{
                user.gender === $enum.Gender.FEMALE.key ? "她" : "他"
              }}的关注</span
            >
          </h3>
          <div class="following-list row">
            <div
              v-for="(item, index) in followingList"
              :key="index"
              class="card following-item"
            >
              <div
                class="cover"
                :style="{
                  backgroundImage: `url(${$img.back(
                    item.background,
                    `backCard`
                  )})`
                }"
              ></div>
              <div class="center" style="padding: 10px;">
                <nuxt-link
                  v-ripple
                  :to="`/user/${item.id}`"
                  class="following-head-box"
                >
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
          <p v-if="followingList.length === 8" class="move">
            <Btn
              round
              flat
              small
              color="primary"
              :to="`/following/${user.id || ''}`"
              >查看更多>></Btn
            >
          </p>
          <img
            v-if="!followingLoading && !followingList.length"
            src="../../../assets/image/default/not.png"
            class="is-not"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import { Pageable } from "../../../assets/script/model"

export default {
  props: {
    user: { type: Object, default: null }
  },
  data() {
    return {
      worksLoading: true,
      worksList: [],
      collectionLoading: true,
      collectionList: [],
      followingLoading: true,
      followingList: []
    }
  },
  mounted() {
    this.pagingWorks()
    this.pagingCollection()
    this.pagingFollower()
  },
  methods: {
    ...mapActions("user", ["APagingByFollowerId"]),
    ...mapActions("draw", ["APagingCollection", "APaging"]),
    getProportion(draw) {
      return draw.height / draw.width
    },
    async pagingWorks() {
      this.worksLoading = true
      const result = await this.APaging(
        Object.assign(new Pageable(0, 8, "createDate,desc"), {
          targetId: this.user.id
        })
      )
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.worksLoading = false
      this.worksList = result.data.content
    },
    async pagingCollection() {
      this.collectionLoading = true
      const result = await this.APagingCollection(
        Object.assign(new Pageable(0, 8, "createDate,desc"), {
          id: this.user.id
        })
      )
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.collectionLoading = false
      this.collectionList = result.data.content
    },
    async pagingFollower() {
      this.followingLoading = true
      const result = await this.APagingByFollowerId(
        Object.assign(new Pageable(0, 8, "createDate,desc"), {
          id: this.user.id
        })
      )
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.followingLoading = false
      this.followingList = result.data.content
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

.user-bk {
  width: 100%;
  margin-top: -@herder-height;
  height: @window-min-width / 2;
  .user-bk-content {
    padding-top: @herder-height;
    width: @visual-width;
    height: 100%;
    margin: 0 auto;
    position: relative;
    .tool {
      position: absolute;
      bottom: 125px;
      right: 100px;
      .btn {
        background-color: rgba(0, 0, 0, 0.3);
        span {
          color: white;
          opacity: 0.7;
        }
      }
    }
  }
}

@media-width-1: 1529px;
@media-width-2: 1276px;

@media only screen and (min-width: @media-width-1) {
  .user-bk {
    height: @media-width-1 / 2;
  }
}

@media only screen and (max-width: @media-width-1) and (min-width: @media-width-2) {
  .user-bk {
    height: @media-width-2 / 2;
  }
}

@media screen and (max-width: @media-width-2) {
  .user-bk {
    height: @window-min-width / 2;
  }
}

.content {
  width: @visual-width;
  margin: -100px auto 24px;
  @head-img-height: 150px;
  @head-img-border: 2px;
  transform: translateY(0);

  .head-box {
    padding: 0 100px;
    img {
      margin-top: -(@head-img-height+ @head-img-border)/2;
      display: inline-block;
      position: absolute;
      height: @head-img-height;
      width: @head-img-height;
      border: @head-img-border solid white;
      border-radius: 50%;
    }
    .info-box {
      margin-left: @head-img-height;
      padding: 20px;
      .name {
        line-height: 30px;
        .icon {
          margin-left: 10px;
          vertical-align: baseline;
          &.ali-icon-female {
            color: @female-color;
          }
          &.ali-icon-male {
            color: @male-color;
          }
        }
      }
      .introduction {
        font-size: @smallest-font-size;
      }
    }
  }

  .draw-box {
    margin-top: 30px;
    padding: 0 50px;
    .line {
      width: 100%;
      border-bottom: 1px dashed @font-color-dark-line;
      margin-bottom: 18px;
      span {
        background-color: white;
        margin-bottom: -15px;
        display: inline-block;
        padding: 0 15px;
        vertical-align: middle;
      }
    }

    .works-box {
      padding-bottom: 24px;
      min-height: 250px;
      .is-not {
        display: block;
        margin: 0 auto;
      }
    }
    .collection-box {
      margin-top: 30px;
      padding-bottom: 24px;
      min-height: 250px;
      .is-not {
        display: block;
        margin: 0 auto;
      }
    }
    .following-box {
      margin-top: 30px;
      padding-bottom: 24px;
      min-height: 250px;
      .is-not {
        display: block;
        margin: 0 auto;
      }
    }
    .move {
      margin-top: 24px;
      text-align: right;
      a {
        color: @theme-color;
      }
    }
    .draw-list {
      .draw-item {
        @size: 230px;
        float: left;
        margin-top: 20px;
        margin-right: 20px;
        overflow: hidden;
        transition: @default-animate-time;
        position: relative;
        width: @size;
        &:nth-child(4n + 1) {
          margin-left: 20px;
        }
      }
    }
    .following-list {
      .following-item {
        @size: 230px;
        @margin: 20px;
        float: left;
        margin-top: @margin;
        margin-right: @margin;
        transition: @default-animate-time;
        overflow: hidden;
        width: @size;
        box-shadow: 0 0 20px rgba(150, 150, 150, 0.55);
        &:nth-child(4n + 1) {
          margin-left: @margin;
        }
        .cover {
          height: @size / 2;
          width: @size;
          transition: @default-animate-time;
        }
        .following-head-box {
          @size: 82px;
          width: @size;
          height: @size;
          border: 2px solid white;
          display: inline-block;
          border-radius: 50%;
          transition: @default-animate-time;
          img {
            border-radius: 50%;
            width: 100%;
            height: 100%;
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
          .following-head-box {
            transform: translateY(-25px) scale(2);
          }
          .user-info-box {
            opacity: 0;
            transform: translateY(25px);
          }
          transform: translateY(-1px);
          box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
        }
      }
    }
  }
}
</style>
