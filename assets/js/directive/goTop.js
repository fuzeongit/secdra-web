function goTop(el, binding) {
  let waitTime = binding.value * 1 || .5;
  if (isNaN(waitTime)) {
    waitTime = .5
  }
  let scrollTopInterval = null;
  el.addEventListener("click", () => {
    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    if (scrollTopInterval || !scrollTop) return;
    const sUnit = .025;
    scrollTopInterval = window.setInterval(() => {
      let thisScrollTop = scrollTop * (1 - sUnit / waitTime);
      scrollTop = thisScrollTop;
      window.scrollTo(0,scrollTop);
      if (thisScrollTop <= 1) {
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
