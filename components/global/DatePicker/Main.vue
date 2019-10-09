<template>
  <div class="date-picker">
    <div class="tool-box">
      <Btn icon flat @click="addCalendar(-1)"
        ><i class="icon ali-icon-back"></i
      ></Btn>
      <div class="tool-item">
        <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
          <div v-show="step === `year`" class="short-duration">
            <button class="btn flat tool default-color" @click="step = `year`">
              {{ Math.floor(this.calendar.getFullYear() / 10) * 10 }}年 -
              {{ Math.floor(this.calendar.getFullYear() / 10) * 10 + 9 }}年
            </button>
          </div>
        </transition>
        <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
          <div v-show="step === `month`" class="short-duration">
            <button class="btn flat tool default-color" @click="step = `year`">
              {{ this.calendar.getFullYear() }}年
            </button>
          </div>
        </transition>
        <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
          <div v-show="step === `day`" class="short-duration">
            <button class="btn flat tool default-color" @click="step = `year`">
              {{ this.calendar.getFullYear() }}年
            </button>
            <button class="btn flat tool default-color" @click="step = `month`">
              {{ this.calendar.getMonth() + 1 }}月
            </button>
          </div>
        </transition>
      </div>
      <Btn icon flat @click="addCalendar(1)"
        ><i class="icon ali-icon-right"></i
      ></Btn>
    </div>
    <div class="content-box">
      <transition
        enter-active-class="fadeIn"
        leave-active-class="fadeOut"
        @after-leave="destroyComponent(`year`)"
        @before-enter="mountComponent(`year`)"
      >
        <div
          v-show="step === `year`"
          ref="year-box"
          class="year-box short-duration"
        ></div>
      </transition>
      <transition
        enter-active-class="fadeIn"
        leave-active-class="fadeOut"
        @after-leave="destroyComponent(`month`)"
        @before-enter="mountComponent(`month`)"
      >
        <div
          v-show="step === `month`"
          ref="month-box"
          class="month-box short-duration"
        ></div>
      </transition>
      <transition
        enter-active-class="fadeIn"
        leave-active-class="fadeOut"
        @after-leave="destroyComponent(`day`)"
        @before-enter="mountComponent(`day`)"
      >
        <div
          v-show="step === `day`"
          ref="calendar-box"
          class="calendar-box short-duration"
        ></div>
      </transition>
    </div>
  </div>
</template>

<script>
import dateUtil from "../../../assets/script/util/dateUtil"
import child from "./child"

export default {
  model: {
    prop: "date",
    event: "change"
  },
  props: {
    date: {
      type: String | Number | Object,
      default: () => new Date()
    },
    format: {
      type: String,
      default: "YYYY-MM-DD"
    },
    type: {
      type: String,
      default: "day",
      validator: (value) => ["year", "month", "day"].includes(value)
    },
    min: {
      type: String | Number | Object | null,
      default: null
    },
    max: {
      type: String | Number | Object | null,
      default: () => null
    }
  },
  data() {
    const calendar = new Date(this.date)
    return {
      calendar,
      stepList: ["year", "month", "day"],
      step: "",
      yearInstance: {},
      monthInstance: {},
      calendarInstance: {}
    }
  },
  computed: {
    normalizedDate() {
      return new Date(this.date)
    }
  },
  watch: {
    date(newVal) {
      this.calendar = new Date(newVal)
      this.yearInstance.date = this.calendar
      this.yearInstance.calendar = this.calendar
      this.monthInstance.date = this.calendar
      this.monthInstance.calendar = this.calendar
      this.calendarInstance.date = this.calendar
      this.calendarInstance.calendar = this.calendar
    }
  },
  mounted() {
    this.step = this.type
  },
  methods: {
    initYear(type) {
      this.yearInstance = child.mountYear(
        this.$refs["year-box"],
        this.calendar,
        this.normalizedDate,
        type,
        this.changeDate
      )
    },
    initMonth(type) {
      this.monthInstance = child.mountMonth(
        this.$refs["month-box"],
        this.calendar,
        this.normalizedDate,
        type,
        this.changeDate
      )
    },
    initCalendar(type) {
      this.calendarInstance = child.mountCalendar(
        this.$refs["calendar-box"],
        this.calendar,
        this.normalizedDate,
        { min: this.min, max: this.max },
        type,
        this.changeDate
      )
    },
    addCalendar(delta) {
      const stepChangeFunction = [
        function(calendar, delta) {
          return dateUtil.addYear(calendar, delta * 10)
        },
        dateUtil.addYear,
        function(calendar, delta) {
          return new Date(
            calendar.getFullYear(),
            calendar.getMonth() + delta,
            1
          )
        }
      ]
      const newCalendar = stepChangeFunction[this.stepList.indexOf(this.step)](
        this.calendar,
        delta
      )
      if (this.calendar.getTime() - newCalendar.getTime() < 0) {
        this.calendar = newCalendar
        const stepNextFunction = [
          () => {
            this.yearInstance.nextClose()
            this.initYear("next")
          },
          () => {
            this.monthInstance.nextClose()
            this.initMonth("next")
          },
          () => {
            this.calendarInstance.nextClose()
            this.initCalendar("next")
          }
        ]
        stepNextFunction[this.stepList.indexOf(this.step)]()
      } else {
        this.calendar = newCalendar
        const stepPrevFunction = [
          () => {
            this.yearInstance.prevClose()
            this.initYear("prev")
          },
          () => {
            this.monthInstance.prevClose()
            this.initMonth("prev")
          },
          () => {
            this.calendarInstance.prevClose()
            this.initCalendar("prev")
          }
        ]
        stepPrevFunction[this.stepList.indexOf(this.step)]()
      }
    },
    changeDate(date, step) {
      this.calendar = date
      const stepNext = ["month", "day", "day"]
      if (step === this.type) {
        this.$emit("change", dateUtil.format(date, this.format))
        return
      }
      this.step = stepNext[this.stepList.indexOf(this.step)]
    },
    mountComponent(step) {
      const stepMountFunctionList = [
        this.initYear,
        this.initMonth,
        this.initCalendar
      ]
      stepMountFunctionList[this.stepList.indexOf(step)]()
    },
    destroyComponent(step) {
      const stepDestroyFunctionList = [
        this.yearInstance.close,
        this.monthInstance.close,
        this.calendarInstance.close
      ]
      stepDestroyFunctionList[this.stepList.indexOf(step)]()
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

.date-picker {
  background-color: white;
  display: inline-block;
  vertical-align: middle;
  @padding: 5px;
  .tool-box {
    display: grid;
    grid-template-columns: @input-line-height auto @input-line-height;
    grid-gap: @padding;
    padding: @padding;
    .tool-item {
      position: relative;
      > div {
        @padding: 0px;
        position: absolute;
        top: @padding;
        bottom: @padding;
        left: @padding;
        right: @padding;
        display: flex;
        justify-content: center;
        align-items: center;
        .tool {
          &:before {
            display: none !important;
          }
          &:hover {
            color: @theme-color;
          }
        }
      }
    }
  }
  .content-box {
    position: relative;
    @size: 270px + @padding;
    width: @size;
    height: @size;
    overflow: hidden;
  }
}
</style>
