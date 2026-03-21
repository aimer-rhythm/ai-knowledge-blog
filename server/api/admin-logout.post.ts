export default defineEventHandler((event) => {
  deleteCookie(event, 'private_admin_token', { path: '/' })
  return { success: true }
})
