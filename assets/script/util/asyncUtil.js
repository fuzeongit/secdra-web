export function requestAnimationFrameSync() {
  return new Promise((resolve, reject) => {
    requestAnimationFrame((now) => {
      resolve(now)
    })
  })
}
