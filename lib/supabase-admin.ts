import { createClient, type User } from '@supabase/supabase-js'
import crypto from 'node:crypto'

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export async function findSupabaseUserByEmail(email: string): Promise<User | null> {
  const admin = getSupabaseAdmin()
  if (!admin) return null
  const normalized = email.trim().toLowerCase()
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error
    const user = data.users.find((entry) => entry.email?.toLowerCase() === normalized)
    if (user) return user
    if (data.users.length < 1000) break
  }
  return null
}

export async function ensureSupabaseUser(email: string, password?: string, metadata?: Record<string, unknown>) {
  const admin = getSupabaseAdmin()
  if (!admin) return { admin: null, user: null }
  const existing = await findSupabaseUserByEmail(email)
  if (existing) {
    if (password) {
      const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: metadata
      })
      if (error) throw error
      return { admin, user: data.user }
    }
    return { admin, user: existing }
  }
  const { data, error } = await admin.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    password: password || crypto.randomBytes(32).toString('base64url'),
    email_confirm: true,
    user_metadata: metadata
  })
  if (error) throw error
  return { admin, user: data.user }
}
