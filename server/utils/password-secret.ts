import { randomBytes } from 'node:crypto'

const secret = process.env.NUXT_PASSWORD_SECRET || randomBytes(32).toString('hex')

export function getPasswordSecret(): string {
  return secret
}
