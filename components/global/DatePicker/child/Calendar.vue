<template>
  <transition
    name="fade"
    :enter-active-class="enterActiveClass"
    :leave-active-class="leaveActiveClass"
    @after-leave="destroyElement"
  >
    <div v-show="visible" class="calendar short-duration">
      <div v-for="item in weekDescList" :key="item" class="week-item">
        {{ item }}
      </div>
      <div
        v-for="(item, index) in calendarDataList"
        :key="index"
        class="calendar-item"
        :style="
          !index
            ? {
                gridColumnStart: firstDayDate.getDay() + 1,
                gridColumnEnd: firstDayDate.getDay() + 2
              }
            : {}
        "
      >
        <Btn
          class="date"
          :flat="!item.active"
          :color="item.active ? `primary` : `default`"
          @click="changeDate(item.day)"
        >
          {{ item.day }}
        </Btn>
      </div>
    </div>
  </transition>
</template>

<script>
import dateUtil from "../../../../assets/script/util/dateUtil"
import datePickerMixin from "../../../../assets/script/mixin/datePickerMixin"

class Calendar {
  constructor(year, month, day, date, active) {
    this.year = year
    this.month = month
    this.day = day
    this.date = date
    this.active = active
  }
}

export default {
  mixins: [datePickerMixin],
  data() {
    return {
      weekDescList: ["日", "一", "二", "三", "四", "五", "六"]
    }
  },
  computed: {
    firstDayDate() {
      return new Date(this.calendar.getFullYear(), this.calendar.getMonth(), 1)
    },
    lastDayDate() {
      return new Date(
        this.calendar.getFullYear(),
        this.calendar.getMonth() + 1,
        0
      )
    },
    calendarDataList() {
      const calendarDataList = []
      const firstDayDate = this.firstDayDate
      const lastDayDate = this.lastDayDate
      for (let i = 0; i < lastDayDate.getDate(); i++) {
        const date = dateUtil.addDay(firstDayDate, +i)
        const active =
          date.getFullYear() === this.date.getFullYear() &&
          date.getMonth() === this.date.getMonth() &&
          date.getDate() === this.date.getDate()
        calendarDataList.push(
          new Calendar(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date,
            active
          )
        )
      }
      return calendarDataList
    }
  },
  methods: {
    changeDate(day) {
      this.date = new Date(
        this.calendar.getFullYear(),
        this.calendar.getMonth(),
        day
      )
      this.clickFunction && this.clickFunction(this.date, `day`)
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import "../../../../assets/style/color";
@import "../../../../assets/style/config";
@import "../../../../assets/style/mixin";

.calendar {
  @padding: 5px;
  position: absolute;
  top: @padding;
  bottom: @padding;
  left: @padding;
  right: @padding;
  display: inline-grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
  .week-item {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: @small-font-size;
    color: @font-color-dark-fade;
  }
  .calendar-item {
    display: flex;
    justify-content: center;
    align-items: center;
    .date {
      width: @small-input-line-height;
      height: @small-input-line-height;
      line-height: @small-input-line-height;
      border-radius: 50%;
      padding: 0;
      font-size: @smallest-font-size;
    }
  }
}
</style>
