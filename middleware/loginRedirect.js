export default async ({ redirect, $axios }) => {
  const responses = await $axios.post(`/account/checkLogin`)
  const result = responses.data || {}
  result.status === 200 && redirect(`/`)
}
