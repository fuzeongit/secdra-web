export default ({redirect, route}) => {
  if (route.fullPath === "/message"||route.fullPath === "/message/") {
    redirect("/message/comment")
  }
}
