<template>
  <div class="page">
    <div class="content row">
      <div class="left-box">
        <div class="card img-card flex-box">
          <img :src="$img.secdra(draw.url)"
               :style="{height:proportion>=1?`100%`:`auto`,width:proportion<=1?`100%`:`auto`}">
        </div>
        <br>
        <Comment :user-id="draw.user.id" :draw-id="draw.id"></Comment>
      </div>
      <div class="right-box">
        <div class="card user-card ">
          <div class="user-bk cover"
               :style="{backgroundImage: `url(${$img.back(draw.user.background,`backCard`)})`}">
          </div>
          <div style="padding: 15px">
            <div class="flex-box">
              <nuxt-link :to="`/user/${draw.user.id}`" class="head-box center" v-ripple>
                <img :src="$img.head(draw.user.head,'small100')">
              </nuxt-link>
              <div class="user-info-box">
                <p class="nickname">
                  <nuxt-link :to="`/user/${draw.user.id}`" class="primary-hover">{{draw.user.name}}</nuxt-link>
                </p>
                <p class="introduction" :title="draw.user.introduction">
                  {{draw.user.introduction}}
                </p>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <Btn block color="primary" v-if="draw.user.id===user.id" @click="isShowEdit=true">编辑</Btn>
              <Btn block color="primary" v-else @click="follow(draw.user.id)">
                {{draw.user.focus===$enum.FollowState.CONCERNED.key?`已关注`:`关注`}}
              </Btn>
            </div>
          </div>
        </div>
        <br>
        <div class="card info-card">
          <h3 class="name"><strong>{{draw.name}}</strong></h3>
          <p class="introduction">{{draw.introduction}}</p>
          <div class="row" style="margin-top: 5px;">
            <div class="col-15">
              <Btn flat icon small title="浏览">
                <i class="icon s-eye"></i>
              </Btn>
              <span>{{draw.viewAmount}}</span>
            </div>
            <div class="col-15">
              <Btn flat icon small :color="draw.focus===$enum.CollectState.CONCERNED.key?`primary`:`default`"
                   @click="collection(draw)" title="收藏">
                <i class="icon"
                   :class="{'s-heart':draw.focus===$enum.CollectState.CONCERNED.key,'s-hearto':draw.focus!==$enum.CollectState.CONCERNED.key}"></i>
              </Btn>
              <span>{{draw.likeAmount}}</span>
            </div>
            <div class="col-30">
              创建于：{{draw.createDate|date}}
            </div>
          </div>
        </div>
        <br>
        <div class="card tag-card">
          <div class="tag-list">
            <Popper trigger="hover" placement="top" @show="showTagPopper(`tag-ref-${index}`)" v-for="(tag,index) in draw.tagList"
            :key="index">
            <TagCard :ref="`tag-ref-${index}`" :tag="tag"></TagCard>
            <Btn outline small color="primary" :to="`/draw/search/${encodeURIComponent(tag)}`" slot="reference">
            {{tag}}
            </Btn>
            </Popper>
            <!--&lt;!&ndash;TODO&ndash;&gt;-->
            <!--<Btn outline small color="primary" :to="`/draw/search/${encodeURIComponent(tag)}`" v-for="(tag,index) in draw.tagList" :key="index">-->
              <!--{{tag}}-->
            <!--</Btn>-->
          </div>
        </div>
      </div>
    </div>
    <Dialog v-model="isShowEdit" title="编辑" v-loading="editLoading" persistent>
      <div class="edit-dialog-content">
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
            </RadioGroup>
          </div>
          <div class="input-group">
            <h5 class="sub-name">标签：</h5>
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
  import TagCard from "../../components/pages/shared/TagCard";
  import Comment from "../../components/pages/draw/Comment";
  import {mapState, mapActions} from "vuex"
  import {CommentForm} from "../../assets/script/model";

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.commit('menu/MChangeName', "");
      let id = route.params.id;
      let res = await $axios.get(`/draw/get`, {
        params: {id}
      });
      let result = res.data;
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      let drawForm = Object.assign({}, result.data);
      return {
        draw: result.data,
        drawForm,
        commentForm: new CommentForm(result.data.user.id, result.data.id)
      }
    },
    data() {
      return {
        isShowEdit: false,
        editLoading: false,
        inputTag: "",
      }
    },
    components: {
      TagCard,
      Comment
    },
    computed: {
      ...mapState("user", ["user"]),
      proportion() {
        return this.draw.height / this.draw.width
      }
    },
    methods: {
      ...mapActions("draw", ["ACollection", "AUpdate"]),
      ...mapActions("user", ["AFollow"]),

      showTagPopper(refId) {
        let ref = this.$refs[refId];
        if (ref === null) {
          return
        }
        if (ref instanceof Array) {
          ref = ref[0]
        }
        if (ref && ref.draw === null) {
          ref.load();
        }
      },
      async collection(draw) {
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
        this.draw.user.focus = result.data
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
      async save() {
        this.editLoading = true;
        let result = await this.AUpdate(this.drawForm);
        this.editLoading = false;
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.$notify({message: `修改成功`});
        this.isShowEdit = false;
        this.draw = result.data;
        this.reset();
      },
      reset() {
        this.drawForm = Object.assign({}, this.draw)
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";

  .page {
    padding: 24px 0;
  }

  .content {
    width: @visual-width;
    margin: 0 auto;
    .left-box {
      width: 850px;
      float: left;
      .img-card {
        position: relative;
        height: 850px;
        .like {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: @big-font-size;
        }
      }

    }
    .right-box {
      @width: 250px;
      width: @width;
      float: right;
      .user-card {
        .user-bk {
          height: @width / 2;
          background-color: @font-color-dark-line;
        }
        @head-img-height: 80px;
        @head-img-border: 2px;
        .head-box {
          border-radius: 50%;
          height: @head-img-height;
          width: @head-img-height;
          border: @head-img-border solid white;
          img {
            height: 100%;
            width: 100%;
            border-radius: 50%;
          }
        }
        .user-info-box {
          width: calc(100% - @head-img-height);
          padding: 0 0 0 10px;
          .nickname {
            .ellipsis()
          }
          .introduction {
            font-size: @smallest-font-size;
            margin-top: 10px;
            .ellipsis()
          }
        }
      }
      .info-card {
        padding: 10px 20px;
        font-size: @small-font-size;
        .name {
          .ellipsis()
        }
        .introduction {
          margin-top: 10px;
          font-size: @smallest-font-size;
          color: @font-color-dark-fade;
        }

      }
      .tag-card {
        @spacing: 10px;
        padding: @spacing 20px;

        .tag-list {
          margin-bottom: -@spacing;
          .btn {
            margin-right: @spacing;
            margin-bottom: @spacing;
          }
        }
      }
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
