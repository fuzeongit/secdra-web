import cookieUtil from '../assets/js/util/cookieUtil'
export default function (context) {
  let token = null;
  try{
    token = cookieUtil.get("token",context.req.headers.cookie);
  }catch (e) {
    token = cookieUtil.get("token");
  }
  if(!token){
    context.redirect('/login')
  }
}
