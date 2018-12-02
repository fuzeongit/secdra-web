<template>
  <div class="page">
    <CheckboxGroup class="content row" v-model="selectList">
      <div class="card " v-for="(draw,index) in list" :key="index">
        <nuxt-link :to="`/draw/${draw.id}`" class="img-box flex-box">
          <img :src="$img.scedra(draw.url,`specifiedWidth`)"
               :style="{height:getProportion(draw)>1?`100%`:`auto`,width:getProportion(draw)<1?`100%`:`auto`}">
        </nuxt-link>
        <div class="tool">
          <Checkbox :value="draw" valueKey="id"></Checkbox>
          <a class="icon like" :class="{'s-heart':draw.focus,'s-hearto':!draw.focus}"
             :style="{color:draw.focus?`red`:`gray`}" title="收藏"
             @click.stop="collection(draw)"></a>
        </div>
        <div class="flex-box info-box">
          <nuxt-link :to="`/user/${draw.user.id}`" class="head-box">
            <img :src="$img.head(draw.user.head)" :title="draw.user.name">
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
            <button class="btn block" @click="follow(draw.user.id)" :disabled="draw.user.focus===null">
              {{draw.user.focus?`已关注`:`关注`}}
            </button>
          </div>
        </div>
      </div>
    </CheckboxGroup>
    <br>
    <Pageable :totalPage="page.totalPages" :currPage="pageable.page" @go="paging"></Pageable>
    <button class="btn is-suspend" style="position: fixed;right: 50px;bottom: 50px;" @click="isShowEdit = true"
            :disabled="selectList.isEmpty()"><i
      class="icon s-bianji"></i></button>
    <Dialog v-model="isShowEdit" title="批量操作">
      <div class="edit-dialog-content">
        <div style="margin-bottom: 10px">
          <Tag v-for="(draw,index) in selectList" :content="draw.name" @close="test" :key="draw.id"
               :value="index"></Tag>
        </div>
        <form @submit.prevent="()=>{}">
          <div class="input-group">
            <h5 class="sub-name">修改名称：</h5>
            <input type="text" title="name" v-model="drawForm.name" class="input block">
          </div>
          <div class="input-group">
            <h5 class="sub-name">修改简介：</h5>
            <textarea v-model="drawForm.introduction" class="input block" title="introduction" rows="3"></textarea>
          </div>
          <div class="input-group">
            <h5 class="sub-name">修改私密：</h5>
            <RadioGroup v-model="drawForm.isPrivate">
              <Radio :value="true" label="隐藏"></Radio>
              <Radio :value="false" label="显示" style="margin-left: 10px"></Radio>
              <Radio :value="null" label="不作修改" style="margin-left: 10px"></Radio>
            </RadioGroup>
          </div>
          <div class="input-group">
            <h5 class="sub-name">添加标签：</h5>
            <div class="row">
              <input type="text" title="name" v-model="inputTag" class="input block col-25">
              <button class="btn is-text col-5" @click="addTag">加</button>
            </div>
          </div>
          <div style="margin-bottom: 10px">
            <Tag v-for="(tagName,index) in drawForm.tagList" @close="removeTag" :content="tagName" :key="tagName"
                 :value="index"></Tag>
          </div>
          <div class="input-group">
            <button class="btn" @click="save">保存</button>
            <button class="btn is-plain" @click="reset">清空</button>
          </div>
        </form>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import PageableCom from '../../../components/global/Pageable'
  import config from "../../../assets/js/config";
  import {DrawForm, Pageable} from "../../../assets/js/model/base";
  import {mapActions} from "vuex"

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "works";
      let pageable = new Pageable();
      pageable.size = 16;
      pageable.page = route.params.page * 1 || 0;
      pageable.sort = "createDate,desc";
      let {data: result} = await $axios.get(`${config.host}/draw/pagingByUserId`, {
        params: Object.assign({
          id: route.params.userId
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
        inputTag: "",
        drawForm: new DrawForm()
      }
    },
    watch: {
      selectList(newVal) {
        if (newVal.isEmpty()) {
          this.isShowEdit = false;
        }
      },
      drawForm: {
        handler(newVal) {
          console.log(newVal);
        },
        deep: true
      }
    },
    components: {
      Pageable: PageableCom
    },
    mounted() {
      this.$notify({message: `说是作品，其实都是从p站下载的，侵删`, waitTime: 4000});
    },
    methods: {
      test({value}) {
        console.log(value);
        this.selectList.removeIndex(value)
      },
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
          followerId: id
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
        let result = await this.ABatchUpdate(form);
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
        box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
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
        user-select: none;
        padding: 0 10px;
        text-align: right;
        .like {
          margin-left: 10px;
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
            font-size: @small-font-size;
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

  .edit-dialog-content {
    width: 600px;
    margin-top: 15px;
    overflow: auto;
    height: 70vh;
    .sub-name {
      line-height: 25px;
      margin-bottom: 5px;
    }
    textarea {
      resize: none;
    }
  }
</style>

