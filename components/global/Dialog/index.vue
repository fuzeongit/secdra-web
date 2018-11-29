<template>
  <transition name="fade" enter-active-class="fadeIn mask-duration" leave-active-class="fadeOut mask-duration">
    <div class="mask " v-show="visible">
      <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
        <div class="card padding-15" v-show="visible">
          <h3>
            {{title}}
          </h3>
          <p>
            {{message}}
          </p>
          <div class="confirm-btn-group">
            <button class="btn is-plain" @click.stop="no">
              {{noDesc}}
            </button>
            <button class="btn" @click.stop="ok">
              {{okDesc}}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  export default {}
</script>

<style  scoped lang="less" type="text/less">

</style>
