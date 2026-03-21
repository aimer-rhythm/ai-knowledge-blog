import { createHmac, timingSafeEqual } from 'node:crypto'

export default defineEventHandler((event) => {
  const cookie = getCookie(event, 'private_admin_token')
  event.context.isPrivateAdmin = false

  if (!cookie) return

  const colonIndex = cookie.indexOf(':')
  if (colonIndex === -1) return

  const timestamp = Number(cookie.substring(0, colonIndex))
  const signature = cookie.substring(colonIndex + 1)

  if (!timestamp || !signature) return

  // 24-hour expiry
  if (Date.now() - timestamp > 24 * 60 * 60 * 1000) return

  const secret = getPasswordSecret()
  const hmac = createHmac('sha256', secret)
  hmac.update(`admin:${timestamp}`)
  const expected = hmac.digest('hex')

  if (
    expected.length === signature.length
    && timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    event.context.isPrivateAdmin = true
  }
})
