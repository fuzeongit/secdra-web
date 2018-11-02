export default {
  host: get ()
}


function get (){
  console.log( process.env.NODE_ENV === "development" ? "/api" : "http://47.107.131.24/api");
  return process.env.NODE_ENV === "development" ? "/api" : "http://47.107.131.24/api"
}
