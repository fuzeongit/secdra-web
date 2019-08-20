<template>
  <div class="date-picker">
    <div class="tool-box">
      <Btn icon flat @click="addCalendar(-1)"><i class="icon ali-icon-back"></i></Btn>
      <div class="tool-item">
        <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
          <div class="short-duration" v-show="step===`year`">
            <button class="btn flat tool default-color" @click="step=`year`">
              {{Math.floor(this.calendar.getFullYear() / 10) * 10}}年 - {{(Math.floor(this.calendar.getFullYear() / 10) *
              10) + 9}}年
            </button>
          </div>
        </transition>
        <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
          <div class="short-duration" v-show="step===`month`">
            <button class="btn flat tool default-color" @click="step=`year`">{{this.calendar.getFullYear()}}年</button>
          </div>
        </transition>
        <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
          <div class="short-duration" v-show="step===`day`">
            <button class="btn flat tool default-color" @click="step=`year`">{{this.calendar.getFullYear()}}年</button>
            <button class="btn flat tool default-color" @click="step=`month`">{{this.calendar.getMonth()+1}}月</button>
          </div>
        </transition>
      </div>
      <Btn icon flat @click="addCalendar(1)"><i class="icon ali-icon-right"></i></Btn>
    </div>
    <div class="content-box">
      <transition enter-active-class="fadeIn" leave-active-class="fadeOut"
                  @after-leave="destroyComponent(`year`)" @before-enter="mountComponent(`year`)">
        <div class="year-box short-duration" ref="year-box" v-show="step===`year`"></div>
      </transition>
      <transition enter-active-class="fadeIn" leave-active-class="fadeOut"
                  @after-leave="destroyComponent(`month`)" @before-enter="mountComponent(`month`)">
        <div class="month-box short-duration" ref="month-box" v-show="step===`month`"></div>
      </transition>
      <transition enter-active-class="fadeIn" leave-active-class="fadeOut"
                  @after-leave="destroyComponent(`day`)" @before-enter="mountComponent(`day`)">
        <div class="calendar-box short-duration" ref="calendar-box" v-show="step===`day`"></div>
      </transition>
    </div>
  </div>
</template>

<script>
  import child from "./child"
  import dateUtil from "../../../assets/script/util/dateUtil";

  export default {
    props: {
      date: {
        default: () => new Date(),
      },
      format: {
        type: String,
        default: "YYYY-MM-DD",
      },
      type: {
        type: String,
        default: 'day',
        validator: value => ['year', 'month', 'day'].indexOf(value) > -1
      }
    },
    model: {
      prop: "date",
      event: "change"
    },
    data() {
      let calendar = new Date(this.date);
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
    watch:{
      date(newVal){
        this.calendar = new Date(newVal);
        this.yearInstance.date = this.calendar;
        this.yearInstance.calendar = this.calendar;
        this.monthInstance.date = this.calendar;
        this.monthInstance.calendar = this.calendar;
        this.calendarInstance.date = this.calendar;
        this.calendarInstance.calendar = this.calendar;
      }
    },
    methods: {
      initYear(type) {
        this.yearInstance = child.mountYear(this.$refs["year-box"], this.calendar, this.normalizedDate, type, this.changeDate)
      },
      initMonth(type) {
        this.monthInstance = child.mountMonth(this.$refs["month-box"], this.calendar, this.normalizedDate, type, this.changeDate)
      },
      initCalendar(type) {
        this.calendarInstance = child.mountCalendar(this.$refs["calendar-box"], this.calendar, this.normalizedDate, type, this.changeDate)
      },
      addCalendar(delta) {
        let stepChangeFunction = [function (calendar, delta) {
          return dateUtil.addYear(calendar, delta * 10)
        }, dateUtil.addYear, function (calendar, delta) {
          return new Date(calendar.getFullYear(), calendar.getMonth() + delta, 1)
        }];
        let newCalendar = stepChangeFunction[this.stepList.indexOf(this.step)](this.calendar, delta);
        if (this.calendar.getTime() - newCalendar.getTime() < 0) {
          this.calendar = newCalendar;
          let stepNextFunction = [
            () => {
              this.yearInstance.nextClose();
              this.initYear("next");
            },
            () => {
              this.monthInstance.nextClose();
              this.initMonth("next");
            },
            () => {
              this.calendarInstance.nextClose();
              this.initCalendar("next")
            },
          ];
          stepNextFunction[this.stepList.indexOf(this.step)]()
        } else {
          this.calendar = newCalendar;
          let stepPrevFunction = [
            () => {
              this.yearInstance.prevClose();
              this.initYear("prev");
            },
            () => {
              this.monthInstance.prevClose();
              this.initMonth("prev");
            },
            () => {
              this.calendarInstance.prevClose();
              this.initCalendar("prev")
            },
          ];
          stepPrevFunction[this.stepList.indexOf(this.step)]()
        }
      },
      changeDate(date, step) {
        this.calendar = date;
        let stepNext = ["month", "day", "day"];
        if (step === this.type) {
          this.$emit("change", dateUtil.format(date, this.format));
          return
        }
        this.step = stepNext[this.stepList.indexOf(this.step)]
      },
      mountComponent(step) {
        let stepMountFunctionList = [this.initYear, this.initMonth, this.initCalendar];
        stepMountFunctionList[this.stepList.indexOf(step)]();
      },
      destroyComponent(step) {
        let stepDestroyFunctionList = [this.yearInstance.close, this.monthInstance.close, this.calendarInstance.close];
        stepDestroyFunctionList[this.stepList.indexOf(step)]();
      }
    },
    mounted() {
      this.step = this.type
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
