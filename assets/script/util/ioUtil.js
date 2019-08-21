export default {
  dataURLtoFile(dataurl, filename = "file") {
    const arr = dataurl.split(",")
    const mime = arr[0].match(/:(.*?);/)[1]
    const suffix = mime.split("/")[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, { type: mime })
  },

  /**
   * @param canvas:HTMLCanvasElement
   * @returns {Promise<Blob>}
   */
  canvasToBlob(canvas) {
    return new Promise(function(resolve, reject) {
      try {
        canvas.toBlob((blobObj) => resolve(blobObj))
      } catch (e) {
        reject(e)
      }
    })
  },

  /**
   *
   * @param url
   * @returns {Promise<*>}
   */
  getOffset(url) {
    const img = new Image()
    img.src = url
    return new Promise(function(resolve, reject) {
      try {
        img.onload = (_) => {
          resolve({ width: img.width, height: img.height })
        }
      } catch (e) {
        reject(e)
      }
    })
  },

  getRoundedCanvas(sourceCanvas, width, height) {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    // let width = sourceCanvas.width;
    const _width = width || sourceCanvas.width
    const _height = height || sourceCanvas.height
    canvas.width = _width
    canvas.height = _height
    context.imageSmoothingEnabled = true
    context.drawImage(sourceCanvas, 0, 0, _width, _height)
    context.globalCompositeOperation = "destination-in"
    context.beginPath()
    context.fill()
    return canvas
  },
  isImage(file, suffixList = ["jpg", "png", "jpeg"]) {
    if (!(file instanceof File)) {
      throw new TypeError("not File")
    }
    if (!file.type.includes("image/")) {
      return false
    }
    if (!suffixList.isEmpty()) {
      const fileSuffix = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase()
      if (!suffixList.includes(fileSuffix)) {
        return false
      }
    }
    return true
  }
}
