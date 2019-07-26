<template>
  <transition name="fade" :enter-active-class="enterActiveClass" :leave-active-class="leaveActiveClass"
              @after-leave="destroyElement">
    <div class="month short-duration" v-show="visible">
      <div v-for="(item,index) in monthList" :key="item.value" class="month-item">
        <Btn flat round icon @click="changeDate(index)" :color="item.active?`primary`:`default`">{{item.value}}</Btn>
      </div>
    </div>
  </transition>
</template>

<script>
  import datePickerMixin from "../../../../assets/script/mixin/datePicker"

  class Month {
    constructor(value, active) {
      this.value = value;
      this.active = active
    }
  }

  export default {
    mixins: [datePickerMixin],
    computed: {
      monthList() {
        let monthList = [];
        for (let i = 0; i < 12; i++) {
          let active = this.calendar.getFullYear() === this.date.getFullYear() && i === this.date.getMonth();
          monthList.push(new Month(i + 1, active))
        }
        return monthList
      }
    },
    methods: {
      changeDate(month) {
        this.date = new Date(this.calendar.getFullYear(), month, 1);
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
