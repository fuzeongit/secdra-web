export function direction() {
  return {
    right: {
      in: "slideInRight",
      out: "slideOutLeft",
      opposite: "left"
    },
    left: {
      in: "slideInLeft",
      out: "slideOutRight",
      opposite: "right"
    },
    up: {
      in: "slideInUp",
      out: "slideOutUp",
      opposite: "down"
    },
    down: {
      in: "slideInDown",
      out: "slideOutDown",
      opposite: "up"
    }
  }
}
