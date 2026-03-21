import { createHmac, timingSafeEqual } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const { key } = await readBody(event)

  if (!key) {
    throw createError({ statusCode: 400, statusMessage: 'Missing key' })
  }

  const privateKey = useRuntimeConfig().privateKey
  if (!privateKey) {
    throw createError({ statusCode: 500, statusMessage: 'Admin key not configured' })
  }

  const keyBuffer = Buffer.from(String(key))
  const expectedBuffer = Buffer.from(privateKey)

  if (
    keyBuffer.length !== expectedBuffer.length
    || !timingSafeEqual(keyBuffer, expectedBuffer)
  ) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid key' })
  }

  const timestamp = Date.now()
  const hmac = createHmac('sha256', getPasswordSecret())
  hmac.update(`admin:${timestamp}`)
  const token = `${timestamp}:${hmac.digest('hex')}`

  setCookie(event, 'private_admin_token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 86400,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  return { success: true }
})
