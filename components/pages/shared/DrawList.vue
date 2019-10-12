<template>
  <div
    class="list-content"
    :style="{
      height: `${normalizedData.height}px`
    }"
  >
    <div
      v-for="(draw, index) in normalizedData.list"
      :key="index"
      class="item card"
      :style="{
        left: `${draw.left}px`,
        top: `${draw.top}px`
      }"
    >
      <nuxt-link v-ripple :to="`/draw/${draw.id}`" class="img-box">
        <img
          :src="$img.secdra(draw.url, `specifiedWidth`)"
          :style="{
            width: listConstant.columnWidth + `px`,
            height: draw.visualHeight + `px`
          }"
        />
      </nuxt-link>
      <Btn
        v-tooltip="
          draw.focus === $enum.CollectState.CONCERNED.key ? `取消收藏` : `收藏`
        "
        flat
        icon
        :color="
          draw.focus === $enum.CollectState.CONCERNED.key ? `red` : `default`
        "
        class="like"
        @click.stop="$emit(`collection`, draw, index)"
      >
        <i
          class="icon"
          :class="{
            'ali-icon-likefill':
              draw.focus === $enum.CollectState.CONCERNED.key,
            'ali-icon-like': draw.focus !== $enum.CollectState.CONCERNED.key
          }"
        ></i>
      </Btn>

      <div
        class="flex-box info-box"
        :style="{
          width: listConstant.columnWidth + `px`,
          height: listConstant.infoHeight + `px`
        }"
      >
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
            @click="$emit(`follow`, draw.user.id)"
          >
            {{
              draw.user.focus === $enum.FollowState.CONCERNED.key
                ? `已关注`
                : `关注`
            }}
          </Btn>
        </div>
      </div>
    </div>
    <div
      v-if="page.last"
      class="item last-card"
      :style="{
        left: `${normalizedData.lastLeft}px`,
        top: `${normalizedData.lastTop}px`,
        width: listConstant.columnWidth + `px`,
        height: listConstant.lastCardHeight + `px`
      }"
    >
      <img src="../../../assets/image/error/404.jpg" />
    </div>
  </div>
</template>

<script>
import { listConstant } from "../../../assets/script/constant"
import windowMixin from "../../../assets/script/mixin/windowMixin"

export default {
  componentName: "DrawList",
  mixins: [windowMixin],
  props: {
    page: {
      type: Object,
      default: null
    },
    list: {
      type: Array,
      default: () => []
    },
    pageLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listConstant: listConstant()
    }
  },
  computed: {
    normalizedData() {
      const list = []
      const columnHeightList = new Array(this.listConstant.columnNumber).fill(0)
      for (let i = 0; i < this.list.length; i++) {
        const draw = this.list[i]
        const minColumnHeight = columnHeightList.min()
        const minColumnIndex = columnHeightList.minIndex()
        const left =
          this.listConstant.gap * (minColumnIndex + 1) +
          this.listConstant.columnWidth * minColumnIndex
        const top = minColumnHeight + this.listConstant.gap
        const visualHeight =
          (draw.height / draw.width) * this.listConstant.columnWidth
        columnHeightList[minColumnIndex] =
          visualHeight + this.listConstant.infoHeight + top
        list.push(Object.assign(draw, { left, top, visualHeight }))
      }
      let lastLeft = 0
      let lastTop = 0
      if (this.page.last) {
        const minColumnHeight = columnHeightList.min()
        const minColumnIndex = columnHeightList.minIndex()
        lastLeft =
          this.listConstant.gap * (minColumnIndex + 1) +
          this.listConstant.columnWidth * minColumnIndex
        lastTop = minColumnHeight + this.listConstant.gap
        columnHeightList[minColumnIndex] =
          lastTop + this.listConstant.lastCardHeight
      }
      const height = columnHeightList.max() + this.listConstant.pageGap
      return {
        list,
        height,
        lastLeft,
        lastTop
      }
    }
  },
  watch: {
    scrollBottom(newVal) {
      if (this.pageLoading) {
        return
      }
      if (newVal > 300) {
        return
      }
      this.$emit("paging")
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

.list-content {
  width: @visual-width;
  margin: 0 auto;
  position: relative;
  height: calc(100vh - @herder-height);
  .item {
    @info-box-height: 80px;
    position: absolute;
    transition: @short-animate-time;

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
    .like {
      position: absolute;
      bottom: @info-box-height + 5px;
      right: 5px;
    }
    .img-box {
      display: block;
      img {
        transition: 0.5s;
        width: 100%;
      }
    }
    .info-box {
      @img-size: 50px;
      @padding-size: 15px;
      padding: @padding-size;
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
        padding: 0 30px;
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
  .last-card {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
