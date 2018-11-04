export default {
  host: process.env.NODE_ENV === "development" ? "/api" : "http://47.107.131.24/api",
  qiniu: process.env.NODE_ENV === "development" ? "http://ph9jy186h.bkt.clouddn.com" : "http://ph9jy186h.bkt.clouddn.com",
  qiniuHead: process.env.NODE_ENV === "development" ? "http://phnqizf7z.bkt.clouddn.com" : "http://phnqizf7z.bkt.clouddn.com",
  qiniuSeparator: process.env.NODE_ENV === "development" ? "-" : "-",
}
