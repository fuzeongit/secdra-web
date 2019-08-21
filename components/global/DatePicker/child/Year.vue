<template>
  <transition
    name="fade"
    :enter-active-class="enterActiveClass"
    :leave-active-class="leaveActiveClass"
    @after-leave="destroyElement"
  >
    <div v-show="visible" class="year short-duration">
      <div v-for="item in yearList" :key="item.value" class="year-item">
        <Btn
          flat
          round
          :color="item.active ? `primary` : `default`"
          @click="changeDate(item.value)"
          >{{ item.value }}</Btn
        >
      </div>
    </div>
  </transition>
</template>

<script>
import datePickerMixin from "../../../../assets/script/mixin/datePickerMixin"

class Year {
  constructor(value, active) {
    this.value = value
    this.active = active
  }
}

export default {
  mixins: [datePickerMixin],
  computed: {
    yearList() {
      const yearList = []
      const thisYear = this.calendar.getFullYear()
      for (
        let i = Math.floor(thisYear / 10) * 10;
        i < Math.floor(thisYear / 10) * 10 + 10;
        i++
      ) {
        yearList.push(new Year(i, i === this.date.getFullYear()))
      }
      return yearList
    }
  },
  methods: {
    changeDate(year) {
      this.date = new Date(year, this.calendar.getMonth(), 1)
      this.clickFunction && this.clickFunction(this.date, `year`)
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import "../../../../assets/style/color";
@import "../../../../assets/style/config";
@import "../../../../assets/style/mixin";

.year {
  @padding: 5px;
  position: absolute;
  top: @padding;
  bottom: @padding;
  left: @padding;
  right: @padding;
  display: inline-grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  .year-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
