import {Result} from "../assets/js/model/base";
import config from "../assets/js/config";

//快速，通过cookie
// export default async ({store, req, redirect, route}) => {
//   let cookies = {};
//   try {
//     cookies = CookieParser.parse(process.server ? req.headers.cookie || "" : document.cookie);
//   } catch (e) {
//     redirect("/login");
//     return false;
//   }
//   if (route.fullPath !== "/login") {
//     if (!cookies.token) {
//       redirect("/login")
//     }
//   }else{
//     if(cookies.token){
//       redirect("/")
//     }
//   }
// }


//严谨，通过验证接口
export default async ({store, req, redirect, route, $axios}) => {
  if (route.fullPath !== "/test") {
    let result = {};
    let user = store.state.user.user || {};
    try {
      let responses = {};
      if (user.id) {
        responses = await $axios.post(`${config.host}/user/checkLogin`);
      } else {
        responses = await $axios.get(`${config.host}/user/getSelfInfo`);
      }
      result = responses.data;
    } catch (e) {
      result = new Result(401, e, "请登录");
    }
    if (!user.id && result.status === 200) {
      store.state.user.user = result.data
    }
    if (result.status === 200 && route.fullPath === "/login") {
      redirect("/")
    } else if (result.status !== 200 && route.fullPath !== "/login") {
      redirect("/login")
    }
  }
}
