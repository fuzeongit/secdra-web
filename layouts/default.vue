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
  import stompMixin from "../assets/script/mixin/stompMixin";
  import {StompSubscribe} from "../assets/script/model";
  import {mapMutations, mapActions} from "vuex"

  export default {
    middleware: ['auth', 'messageRedirect'],
    mixins: [stompMixin],
    components: {
      Header
    },
    async mounted() {
      this.countUnread();
      await this.AStompConnect();
    },
    methods: {
      ...mapMutations("message", ["MChangeCount"]),
      ...mapActions("message", ["ACount"]),
      ...mapActions("stomp", ["AStompConnect"]),
      stompSubscribeList() {
        return [new StompSubscribe("/user/following/focus", (result) => {
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
