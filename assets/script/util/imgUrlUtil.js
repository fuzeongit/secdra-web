export default {
  secdra(url, type) {
    if(url){
      if (url.indexOf("blob") === 0 || url.indexOf("http") === 0) return url;
      if (type) {
        return `${process.env.qiniuImg}/${url}${process.env.qiniuSeparator}${type}`
      } else {
        return `${process.env.qiniuImg}/${url}`
      }
    }

  },
  head(url, type) {
   if(url){
     if (url.indexOf("blob") === 0 || url.indexOf("http") === 0) return url;
     if (type) {
       return `${process.env.qiniuHead}/${url}${process.env.qiniuSeparator}${type}`
     } else {
       return `${process.env.qiniuHead}/${url}`
     }
   }
  },
  back(url, type, is) {
    if(url){
      if (url.indexOf("blob") === 0 || url.indexOf("http") === 0) return url;
      if (type) {
        if (is) {
          return `${process.env.qiniuBack}/${url}?${type}`
        } else {
          return `${process.env.qiniuBack}/${url}${process.env.qiniuSeparator}${type}`
        }
      } else {
        return `${process.env.qiniuBack}/${url}`
      }
    }
  }
}
