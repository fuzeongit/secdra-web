<template>
  <div class="page">
    <CheckboxGroup class="content row" v-model="selectList">
      <div class="card " v-for="(draw,index) in list" :key="index">
        <nuxt-link :to="`/draw/${draw.id}`" class="img-box flex-box" v-ripple>
          <img :src="$img.secdra(draw.url,`specifiedWidth`)"
               :style="{height:getProportion(draw)>=1?`100%`:`auto`,width:getProportion(draw)<=1?`100%`:`auto`}">
        </nuxt-link>
        <div class="tool">
          <Checkbox v-if="isSelf" :value="draw" valueKey="id" small color="primary"></Checkbox>
          <Btn flat icon :color="draw.focus===$enum.CollectState.CONCERNED.key?`primary`:`default`" @click.stop="collection(draw)" small title="收藏">
            <i class="icon" :class="{'s-heart':draw.focus===$enum.CollectState.CONCERNED.key,'s-hearto':draw.focus!==$enum.CollectState.CONCERNED.key}"></i>
          </Btn>
        </div>
        <div v-if="!isSelf" class="flex-box info-box">
          <nuxt-link :to="`/user/${draw.user.id}`" class="head-box" v-ripple>
            <img :src="$img.head(draw.user.head,'small50')" :title="draw.user.name">
          </nuxt-link>
          <div class="user-info-box">
            <p class="nickname">
              {{draw.user.name}}
            </p>
            <p class="introduction" :title="draw.user.introduction">
              {{draw.user.introduction}}
            </p>
          </div>
          <div class="follow-box flex-box">
            <Btn block color="primary" @click="follow(draw.user.id)" :disabled="draw.user.focus===$enum.FollowState.SElF.key">
              {{draw.user.focus===$enum.FollowState.CONCERNED.key?`已关注`:`关注`}}
            </Btn>
          </div>
        </div>
      </div>
    </CheckboxGroup>
    <br>
    <Pageable :totalPage="page.totalPages" :currPage="pageable.page" @go="paging"></Pageable>
    <Btn icon big shadow color="white" v-if="isSelf" class="edit-btn" @click="isShowEdit = true"
         :disabled="selectList.isEmpty()">
      <i class="icon s-bianji"></i>
    </Btn>
    <Dialog v-if="isSelf" v-model="isShowEdit" title="批量操作" v-loading="editLoading" persistent>
      <div class="edit-dialog-content">
        <div style="margin-bottom: 10px">
          <Tag v-for="(draw,index) in selectList" :content="draw.name" @close="removeSelectDraw" :key="draw.id"
               color="primary"
               :value="index"></Tag>
        </div>
        <div>
          <div class="input-group">
            <h5 class="sub-name">名称：</h5>
            <input type="text" title="name" v-model="drawForm.name" class="input block primary-color">
          </div>
          <div class="input-group">
            <h5 class="sub-name">简介：</h5>
            <textarea v-model="drawForm.introduction" class="input block textarea primary-color" title="introduction"
                      rows="3"></textarea>
          </div>
          <div class="input-group">
            <h5 class="sub-name">私密：</h5>
            <RadioGroup v-model="drawForm.privacy">
              <Radio :value="item.key" :label="item.value" color="primary" v-for="item in $enum.PrivacyState"
                     :key="item.key" style="margin-right: 10px"></Radio>
              <Radio :value="null" label="不作修改" color="primary" style="margin-left: 10px"></Radio>
            </RadioGroup>
          </div>
          <div class="input-group">
            <h5 class="sub-name">添加标签：</h5>
            <input type="text" title="name" v-model="inputTag" class="input block primary-color" @keyup.enter="addTag">
            <h5 class="sub-name">*回车添加一个标签</h5>
          </div>
          <div style="margin-bottom: 10px">
            <Tag v-for="(tagName,index) in drawForm.tagList" @close="removeTag" :content="tagName" :key="tagName"
                 color="primary"
                 :value="index"></Tag>
          </div>
        </div>
      </div>
      <div class="input-group" style="text-align: center;">
        <Btn color="primary" @click="save">保存</Btn>
        <Btn outline color="primary" @click="reset">重置</Btn>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import {DrawForm, Pageable} from "../../../assets/script/model";
  import {mapActions} from "vuex"

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.commit('menu/MChangeName', "works");
      let pageable = new Pageable();
      pageable.size = 16;
      pageable.page = route.params.page * 1 || 0;
      pageable.sort = "createDate,desc";
      let {data: result} = await $axios.get(`/draw/paging`, {
        params: Object.assign({
          targetId: route.params.userId
        }, pageable)
      });
      if (result.status !== 200) {
        throw new Error(result.message)
      }
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
    watch: {
      selectList(newVal) {
        if (newVal.isEmpty()) {
          this.isShowEdit = false;
        }
      }
    },
    computed: {
      isSelf() {
        return this.$store.state.user.user.id === this.$route.params.userId
      }
    },
    mounted() {
      this.$notify({message: `说是作品，其实都是从p站下载的，侵删`, waitTime: 4000});
    },
    methods: {
      ...mapActions("draw", ["ACollection", "ABatchUpdate"]),
      ...mapActions("user", ["AFollow"]),
      getProportion(draw) {
        return draw.height / draw.width
      },
      paging(page) {
        this.$router.push(`/works/${this.$route.params.userId}/${page}`);
      },
      async collection(draw, index) {
        let result = await this.ACollection({
          drawId: draw.id
        });
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        draw.focus = result.data;
      },
      async follow(id) {
        let result = await this.AFollow({
          followingId: id
        });
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        for (let draw of this.list) {
          if (draw.user.id === id) {
            draw.user.focus = result.data
          }
        }
      },
      removeSelectDraw({value}) {
        this.selectList.removeIndex(value)
      },
      addTag() {
        if (this.inputTag === null || this.inputTag === "") {
          this.inputTag = "";
          return
        }
        if (this.drawForm.tagList.indexOf(this.inputTag) !== -1) {
          this.inputTag = "";
          this.$message({
            message: "不能重复添加"
          });
          return
        }
        this.drawForm.tagList.push(this.inputTag);
        this.inputTag = "";
      },
      removeTag({value}) {
        this.drawForm.tagList.removeIndex(value)
      },
      reset() {
        this.inputTag = "";
        this.drawForm = new DrawForm();
      },
      async save() {
        let form = this.drawForm;
        form.idList = this.selectList.map(item => item.id);
        this.editLoading = true;
        let result = await this.ABatchUpdate(form);
        this.editLoading = false;
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.inputTag = "";
        this.selectList.clear();
        this.drawForm = new DrawForm();
        this.$notify({message: "批量更新完毕"});
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
      &:nth-child(4n+1) {
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
            .ellipsis()
          }
          .introduction {
            font-size: @smallest-font-size;
            margin-top: 10px;
            .ellipsis()
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

