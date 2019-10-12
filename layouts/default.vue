<template>
  <div>
    <ScrollBar></ScrollBar>
    <section>
      <Header></Header>
      <transition
        name="fade"
        enter-active-class="fadeIn duration"
        leave-active-class="fadeOut duration"
      >
        <nuxt />
      </transition>
      <Footer></Footer>
    </section>
  </div>
</template>
<script>
import { mapMutations, mapActions, mapState } from "vuex"
import Header from "../components/pages/shared/Header"
import ScrollBar from "../components/global/ScrollBar"
import stompMixin from "../assets/script/mixin/stompMixin"
import { StompSubscribe } from "../assets/script/model"
import Footer from "../components/pages/shared/Footer"

export default {
  middleware: ["messageRedirect"],
  components: {
    Footer,
    Header,
    ScrollBar
  },
  mixins: [stompMixin],
  computed: {
    ...mapState("user", ["user"]),
    signedIn() {
      return this.user && this.user.id
    }
  },
  async mounted() {
    this.signedIn && this.countUnread()
    await this.AStompConnect()
  },
  methods: {
    ...mapMutations("message", ["MChangeCount"]),
    ...mapActions("message", ["ACount"]),
    ...mapActions("stomp", ["AStompConnect"]),
    stompSubscribeList() {
      return [
        new StompSubscribe("/user/comment/send", (result) => {
          if (result.message) this.$notify({ message: result.message })
          this.MChangeCount({ type: "comment", count: result.data })
        }),
        new StompSubscribe("/user/reply/send", (result) => {
          if (result.message) this.$notify({ message: result.message })
          this.MChangeCount({ type: "reply", count: result.data })
        }),
        new StompSubscribe("/user/following/focus", (result) => {
          if (result.message) this.$notify({ message: result.message })
          this.MChangeCount({ type: "follow", count: result.data })
        })
      ]
    },
    async countUnread() {
      const result = await this.ACount()
      if (result.status !== 200) {
        return
      }
      this.MChangeCount({ type: "comment", count: result.data.COMMENT })
      this.MChangeCount({ type: "reply", count: result.data.REPLY })
      this.MChangeCount({ type: "follow", count: result.data.FOLLOW })
      this.MChangeCount({ type: "system", count: result.data.SYSTEM })
    }
  }
}
</script>
<style type="text/less" lang="less" scoped></style>
