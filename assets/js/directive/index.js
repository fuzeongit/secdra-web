import {VNodeDirective} from "vue"

/**
 * 延迟显示指令
 * @param {HTMLElement} el
 * @param {VNodeDirective} binding
 * @returns {boolean}
 */
function showWait(el, binding) {
  const {
    scrollTop = 0,//滚动高度
    offset = 100,//偏移距离
    animate = "fadeInUp",//动画
    delayTime = 0,//延迟时间
  } = binding.value;

  if (el.getAttribute("data-show-wait") === "ready" || el.classList.contains(animate)) {
    return false;
  }

  if (!el.classList.contains("animated")) {
    el.classList.add("animated")
  }

  if (scrollTop + window.innerHeight >= el.offsetTop + offset) {
    el.setAttribute("data-show-wait", "ready");
    setTimeout(() => {
      el.style.visibility = "visible";
      el.classList.add(animate);
    }, delayTime)

    // const removeClass = () => {
    //   el.removeEventListener('animationend', removeClass);
    //   el.classList.remove(animate)
    // };
    // el.addEventListener("animationend", removeClass)
  }
}


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
  showWait,
  goTop
}
