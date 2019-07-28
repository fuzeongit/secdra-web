<template>
  <div>
    <section>
      <Header></Header>
      <transition name="fade" enter-active-class="fadeIn duration" leave-active-class="fadeOut duration">
        <nuxt/>
      </transition>
    </section>
  </div>
</template>
<script>
  import Header from "../components/pages/shared/Header"
  import socket from "../assets/script/mixin/socket";
  import {SocketEvent} from "../assets/script/model/base";
  import {mapMutations, mapActions} from "vuex"

  export default {
    middleware: ['auth', 'messageRedirect'],
    mixins: [socket],
    components: {
      Header
    },
    async mounted() {
      this.countUnread();
      await this.ASocketConnect();
    },
    methods: {
      ...mapMutations("message", ["MChangeCount"]),
      ...mapActions("message", ["ACount"]),
      ...mapActions("socket", ["ASocketConnect"]),
      socketEvent() {
        return [new SocketEvent("/user/following/focus", (result) => {
          if (result.message) this.$notify({message: result.message});
          this.MChangeCount({type: 'follow', count: result.data});
        })]
      },
      async countUnread() {
        let result = await this.ACount();
        if (result.status !== 200) {
          return
        }
        this.MChangeCount({type: 'comment', count: result.data.COMMENT});
        this.MChangeCount({type: 'reply', count: result.data.REPLY});
        this.MChangeCount({type: 'follow', count: result.data.FOLLOW});
        this.MChangeCount({type: 'system', count: result.data.SYSTEM});
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
</style>
