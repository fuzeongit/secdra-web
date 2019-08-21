<template>
  <div class="page">
    <CheckboxGroup v-model="selectList" class="content row">
      <div v-for="(draw, index) in list" :key="index" class="card ">
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
          <Checkbox
            v-if="isSelf"
            :value="draw"
            value-key="id"
            small
            color="primary"
          ></Checkbox>
          <Btn
            flat
            icon
            :color="
              draw.focus === $enum.CollectState.CONCERNED.key
                ? `primary`
                : `default`
            "
            small
            title="收藏"
            @click.stop="collection(draw)"
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
        </div>
        <div v-if="!isSelf" class="flex-box info-box">
          <nuxt-link v-ripple :to="`/user/${draw.user.id}`" class="head-box">
            <img
              :src="$img.head(draw.user.head, 'small50')"
              :title="draw.user.name"
            />
          </nuxt-link>
          <div class="user-info-box">
            <p class="nickname">
              {{ draw.user.name }}
            </p>
            <p class="introduction" :title="draw.user.introduction">
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
      </div>
    </CheckboxGroup>
    <br />
    <Pageable
      :total-page="page.totalPages"
      :curr-page="pageable.page"
      @go="paging"
    ></Pageable>
    <Btn
      v-if="isSelf"
      icon
      big
      shadow
      color="white"
      class="edit-btn"
      :disabled="selectList.isEmpty()"
      @click="isShowEdit = true"
    >
      <i class="icon ali-icon-edit"></i>
    </Btn>
    <Dialog
      v-if="isSelf"
      v-model="isShowEdit"
      v-loading="editLoading"
      title="批量操作"
      persistent
    >
      <ScrollBox class="edit-dialog-content">
        <div style="margin-bottom: 10px">
          <Tag
            v-for="(draw, index) in selectList"
            :key="draw.id"
            :content="draw.name"
            color="primary"
            :value="index"
            @close="removeSelectDraw"
          ></Tag>
        </div>
        <div>
          <div class="input-group">
            <h5 class="sub-name">名称：</h5>
            <Field v-model="drawForm.name" block color="primary"></Field>
          </div>
          <div class="input-group">
            <h5 class="sub-name">简介：</h5>
            <Field
              v-model="drawForm.introduction"
              block
              color="primary"
              type="textarea"
            ></Field>
          </div>
          <div class="input-group">
            <h5 class="sub-name">私密：</h5>
            <RadioGroup v-model="drawForm.privacy">
              <Radio
                v-for="item in $enum.PrivacyState"
                :key="item.key"
                :value="item.key"
                :label="item.value"
                color="primary"
                style="margin-right: 10px"
              ></Radio>
              <Radio
                :value="null"
                label="不作修改"
                color="primary"
                style="margin-left: 10px"
              ></Radio>
            </RadioGroup>
          </div>
          <div class="input-group">
            <h5 class="sub-name">添加标签：</h5>
            <Field v-model="inputTag" block color="primary"></Field>
            <h5 class="sub-name">*标签以空格分隔为一个</h5>
          </div>
        </div>
      </ScrollBox>
      <div class="input-group" style="text-align: center;">
        <Btn color="primary" @click="save">保存</Btn>
        <Btn outline color="primary" @click="reset">重置</Btn>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import { DrawForm, Pageable } from "../../../assets/script/model"

export default {
  computed: {
    isSelf() {
      return this.$store.state.user.user.id === this.$route.params.userId
    }
  },
  watch: {
    selectList(newVal) {
      if (newVal.isEmpty()) {
        this.isShowEdit = false
      }
    }
  },
  async asyncData({ store, req, redirect, route, $axios }) {
    store.commit("menu/MChangeName", "works")
    const pageable = new Pageable()
    pageable.size = 16
    pageable.page = route.params.page * 1 || 0
    pageable.sort = "createDate,desc"
    const { data: result } = await $axios.get(`/draw/paging`, {
      params: Object.assign(
        {
          targetId: route.params.userId
        },
        pageable
      )
    })
    return {
      pageable,
      page: result.data,
      list: result.data.content,
      selectList: [],
      isShowEdit: false,
      editLoading: false,
      inputTag: "",
      drawForm: new DrawForm()
    }
  },
  mounted() {
    this.$notify({
      message: `说是作品，其实都是从p站下载的，侵删`,
      waitTime: 4000
    })
  },
  methods: {
    ...mapActions("draw", ["ACollection", "ABatchUpdate"]),
    ...mapActions("user", ["AFollow"]),
    getProportion(draw) {
      return draw.height / draw.width
    },
    paging(page) {
      this.$router.push(`/works/${this.$route.params.userId}/${page}`)
    },
    async collection(draw, index) {
      const result = await this.ACollection({
        drawId: draw.id
      })
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      draw.focus = result.data
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
    },
    removeSelectDraw({ value }) {
      this.selectList.removeIndex(value)
    },
    reset() {
      this.inputTag = ""
      this.drawForm = new DrawForm()
    },
    async save() {
      const form = this.drawForm
      form.idList = this.selectList.map((item) => item.id)
      const tagList = this.inputTag.split(" ").filter((item) => item !== "")
      form.tagList = [...new Set(tagList)]
      this.editLoading = true
      const result = await this.ABatchUpdate(form)
      this.editLoading = false
      if (result.status !== 200) {
        this.$notify({ message: result.message })
        return
      }
      this.inputTag = ""
      this.selectList.clear()
      this.drawForm = new DrawForm()
      this.$notify({ message: "批量更新完毕" })
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

@info-box-height: 80px;
.content {
  width: @visual-width;
  margin: 0 auto;
  .card {
    @size: 250px;
    float: left;
    margin-top: 24px;
    margin-right: 24px;
    overflow: hidden;
    transition: @default-animate-time;
    position: relative;
    width: @size;
    &:nth-child(4n + 1) {
      margin-left: 24px;
    }
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
        margin-left: 10px;
      }
    }
    .info-box {
      margin-top: -10px;
      @img-size: 50px;
      @padding-size: 15px;
      padding: @padding-size;
      overflow: hidden;
      .head-box {
        display: block;
        position: relative;
        border-radius: 50%;
        transition: @default-animate-time;
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
}

.edit-btn {
  position: fixed;
  right: 50px;
  bottom: 50px;
  i {
    color: @font-color-dark;
  }
}

.edit-dialog-content {
  width: 600px;
  margin-top: 15px;
  overflow: auto;
  height: 500px;
  .sub-name {
    line-height: 25px;
    margin-bottom: 5px;
  }
}
</style>
