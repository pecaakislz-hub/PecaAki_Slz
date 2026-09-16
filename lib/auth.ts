import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { db } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'pecaaki_secret_key_slz_2026'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get('pecaaki_token')?.value

  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const user = await db.findUserById(payload.userId)
  if (!user) return null

  const { passwordHash, ...safeUser } = user
  return safeUser
}
