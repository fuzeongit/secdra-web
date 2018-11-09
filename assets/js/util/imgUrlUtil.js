import config from "../config"

export default {
  scedra(url, type) {
    if(type){
      return `${config.qiniu}/${url}${config.qiniuSeparator}${type}`
    }else{
      return `${config.qiniu}/${url}`
    }
  },
  head(url,type){
    if(type){
      return `${config.qiniuHead}/${url}${config.qiniuSeparator}${type}`
    }else{
      return `${config.qiniuHead}/${url}`
    }
  },
  back(url,type,is){
    if(type){
      if(is){
        return `${config.qiniuBack}/${url}?${type}`
      }else{
        return `${config.qiniuBack}/${url}${config.qiniuSeparator}${type}`
      }

    }else{
      return `${config.qiniuBack}/${url}`
    }
  }
}
