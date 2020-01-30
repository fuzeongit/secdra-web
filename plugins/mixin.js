import Vue from "vue"
import VueLazyload from "vue-lazyload"

import {
  Alert,
  Confirm,
  Loading,
  Message,
  Notification,
  Prompt
} from "../components/global"
import Popper from "../components/global/Popper"
import Dialog from "../components/global/Dialog"
import DatePicker from "../components/global/DatePicker/Main"
import Tag from "../components/global/Tag"
import TagInput from "../components/global/TagInput"
import Pageable from "../components/global/Pageable"
import ScrollBox from "../components/global/ScrollBox"
import Delay from "../components/global/Delay"
import Carousel from "../components/global/Carousel"
import CarouselItem from "../components/global/Carousel/item"
import CheckboxGroup from "../components/form/CheckboxGroup"
import Checkbox from "../components/form/Checkbox"
import RadioGroup from "../components/form/RadioGroup"
import Radio from "../components/form/Radio"
import Btn from "../components/form/Btn"
import Field from "../components/form/Field"
import DateInput from "../components/form/DateInput"

import Http from "../assets/script/util/httpUtil"
import Img from "../assets/script/util/imgUrlUtil"
import filters from "../assets/script/filter"
import directive from "../assets/script/directive"
import { enumObjectList } from "../assets/script/constant"

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})

Vue.prototype.$alert = Alert
Vue.prototype.$confirm = Confirm
Vue.prototype.$prompt = Prompt
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
Vue.prototype.$loading = Loading
Vue.component("Popper", Popper)
Vue.component("Dialog", Dialog)
Vue.component("DatePicker", DatePicker)
Vue.component("Tag", Tag)
Vue.component("TagInput", TagInput)
Vue.component("Pageable", Pageable)
Vue.component("ScrollBox", ScrollBox)
Vue.component("Carousel", Carousel)
Vue.component("CarouselItem", CarouselItem)
Vue.component("CheckboxGroup", CheckboxGroup)
Vue.component("Checkbox", Checkbox)
Vue.component("RadioGroup", RadioGroup)
Vue.component("Radio", Radio)
Vue.component("Btn", Btn)
Vue.component("Field", Field)
Vue.component("DateInput", DateInput)
Vue.component("Delay", Delay)

Vue.prototype.$domain = process.env.domain
Vue.prototype.$http = Http
Vue.prototype.$img = Img

Vue.prototype.$filter = filters
Vue.prototype.$enum = enumObjectList

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.directive("popover", directive.popover)
Vue.directive("tooltip", directive.tooltip)
Vue.directive("loading", directive.loading)
Vue.directive("ripple", directive.ripple)
Vue.directive("scrollbar", directive.scrollbar)
