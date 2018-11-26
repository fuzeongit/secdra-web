export default {
  host: process.env.NODE_ENV === "development" ? "/api" : "http://www.secdra.com/api",
  qiniu: process.env.NODE_ENV === "development" ? "http://secdraimg.secdra.com" : "http://secdraimg.secdra.com",
  qiniuHead: process.env.NODE_ENV === "development" ? "http://secdrahead.secdra.com" : "http://secdrahead.secdra.com",
  qiniuBack: process.env.NODE_ENV === "development" ? "http://secdraback.secdra.com" : "http://secdraback.secdra.com",
  qiniuSeparator: process.env.NODE_ENV === "development" ? "-" : "-",
}
