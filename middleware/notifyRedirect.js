export default ({redirect, route}) => {
  if (route.fullPath === "/notify"||route.fullPath === "/notify/") {
    redirect("/notify/comment")
  }
}
