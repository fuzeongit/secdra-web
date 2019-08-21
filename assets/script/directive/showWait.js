/**
 * 延迟显示指令
 * @param {HTMLElement} el
 * @param binding
 * @returns {boolean}
 */
function showWait(el, binding) {
  const {
    scrollTop = 0, // 滚动高度
    offset = 100, // 偏移距离
    animate = "fadeInUp", // 动画
    delayTime = 0 // 延迟时间
  } = binding.value

  if (
    el.getAttribute("data-show-wait") === "ready" ||
    el.classList.contains(animate)
  ) {
    return false
  }

  if (!el.classList.contains("animated")) {
    el.classList.add("animated")
  }

  if (scrollTop + window.innerHeight >= el.offsetTop + offset) {
    el.setAttribute("data-show-wait", "ready")
    setTimeout(() => {
      el.style.visibility = "visible"
      el.classList.add(animate)
    }, delayTime)
  }
}

export default { showWait }
