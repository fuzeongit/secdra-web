import CookieParser from 'cookieparser'
import {Result} from "../assets/js/model/base";

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
  let result = {};
  let responses = {};
  try {
    let responses = await $axios.post("/api/user/checkLogin");
    result = responses.data;
  } catch (e) {
    result = new Result(401, e, "请登录");
  }
  if (result.status === 200 && route.fullPath === "/login") {
    redirect("/")
  } else if (result.status !== 200 && route.fullPath !== "/login") {
    redirect("/login")
  }
}
