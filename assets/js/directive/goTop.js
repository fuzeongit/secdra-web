function goTop(el, binding) {
  let waitTime = binding.value * 1 || .5;
  if (isNaN(waitTime)) {
    waitTime = .5
  }
  let scrollTopInterval = null;
  el.addEventListener("click", () => {
    if (scrollTopInterval || !document.documentElement.scrollTop) return;
    const sUnit = .025;
    scrollTopInterval = window.setInterval(() => {
      let thisScrollTop = document.documentElement.scrollTop * (1 - sUnit / waitTime);
      document.body.scrollTop = document.documentElement.scrollTop = thisScrollTop;
      if (thisScrollTop <= 0) {
        window.clearInterval(scrollTopInterval);
        scrollTopInterval = null
      }
    }, sUnit);
  })
}

export default {
  inserted(el, binding, vnode) {
    goTop(el, binding, vnode);
  }
}
