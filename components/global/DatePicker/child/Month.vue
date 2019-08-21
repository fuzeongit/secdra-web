<template>
  <transition
    name="fade"
    :enter-active-class="enterActiveClass"
    :leave-active-class="leaveActiveClass"
    @after-leave="destroyElement"
  >
    <div v-show="visible" class="month short-duration">
      <div
        v-for="(item, index) in monthList"
        :key="item.value"
        class="month-item"
      >
        <Btn
          flat
          round
          icon
          :color="item.active ? `primary` : `default`"
          @click="changeDate(index)"
          >{{ item.value }}</Btn
        >
      </div>
    </div>
  </transition>
</template>

<script>
import datePickerMixin from "../../../../assets/script/mixin/datePickerMixin"

class Month {
  constructor(value, active) {
    this.value = value
    this.active = active
  }
}

export default {
  mixins: [datePickerMixin],
  computed: {
    monthList() {
      const monthList = []
      for (let i = 0; i < 12; i++) {
        const active =
          this.calendar.getFullYear() === this.date.getFullYear() &&
          i === this.date.getMonth()
        monthList.push(new Month(i + 1, active))
      }
      return monthList
    }
  },
  methods: {
    changeDate(month) {
      this.date = new Date(this.calendar.getFullYear(), month, 1)
      this.clickFunction && this.clickFunction(this.date, `month`)
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import "../../../../assets/style/color";
@import "../../../../assets/style/config";
@import "../../../../assets/style/mixin";

.month {
  @padding: 5px;
  position: absolute;
  top: @padding;
  bottom: @padding;
  left: @padding;
  right: @padding;
  display: inline-grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  .month-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
