import Vue from 'vue'

import {Alert, Confirm, Message, Prompt,Notification} from '../components/global'
import Popper from "../components/global/Popper";
import Dialog from "../components/global/Dialog";
import Tag from "../components/global/Tag";
import Pageable from "../components/global/Pageable";
import CheckboxGroup from "../components/form/CheckboxGroup";
import Checkbox from "../components/form/Checkbox";
import RadioGroup from "../components/form/RadioGroup";
import Radio from "../components/form/Radio";

import Http from '../assets/js/util/httpUtil'
import Img from '../assets/js/util/imgUrlUtil'
import filters from "../assets/js/filter"
import directive from "../assets/js/directive"

Vue.prototype.$alert = Alert;
Vue.prototype.$confirm = Confirm;
Vue.prototype.$prompt = Prompt;
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;
Vue.component("Popper",Popper);
Vue.component("Dialog",Dialog);
Vue.component("Tag",Tag);
Vue.component("Pageable",Pageable);
Vue.component("CheckboxGroup",CheckboxGroup);
Vue.component("Checkbox",Checkbox);
Vue.component("RadioGroup",RadioGroup);
Vue.component("Radio",Radio);
// import vueSocketIO from 'vue-socket.io'
// import io from 'socket.io-client'
// Vue.use(vueSocketIO,io("http://47.107.131.24:8089"));

Vue.prototype.$http = Http;

Vue.prototype.$img = Img;

Vue.prototype.$filter = filters;
for (let name in filters) {
  Vue.filter(name, filters[name])
}

Vue.directive("goTop", directive.goTop);
Vue.directive("popover", directive.popover);
//
// for (let name in directive) {
//   Vue.directive(name, directive[name])
// }
