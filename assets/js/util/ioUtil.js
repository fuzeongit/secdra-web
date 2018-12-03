export default {
  dataURLtoFile(dataurl, filename = 'file') {
    let arr = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let suffix = mime.split('/')[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {type: mime})
  },

  /**
   * @param canvas:HTMLCanvasElement
   * @returns {Promise<Blob>}
   */
  canvasToBlob(canvas) {
    return new Promise(function (resolve, reject) {
      try {
        canvas.toBlob(blobObj => resolve(blobObj));
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
    let img = new Image();
    img.src = url;
    return new Promise(function (resolve, reject) {
      try {
        img.onload = _ => {
          resolve({width: img.width, height: img.height});
        }
      } catch (e) {
        reject(e)
      }
    })
  },

  getRoundedCanvas(sourceCanvas) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    // let width = sourceCanvas.width;
    let width = sourceCanvas.width;
    let height = sourceCanvas.height;
    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = "destination-in";
    context.beginPath();
    context.fill();
    return canvas;
  },
}
