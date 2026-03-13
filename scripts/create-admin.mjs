#!/usr/bin/env node
/**
 * CLI helper — create an ElevaForge admin user.
 *
 * Outputs the scrypt password hash ready to INSERT into Supabase,
 * and optionally inserts it directly if SUPABASE credentials are provided.
 *
 * Usage (hash only — paste into Supabase SQL editor):
 *   node scripts/create-admin.mjs <username> <password>
 *
 * Usage (insert directly via Supabase REST API):
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=your_key \
 *   node scripts/create-admin.mjs <username> <password>
 *
 * SECURITY: Run this script LOCALLY only. Never share the output hash in logs.
 */

import crypto from 'crypto'

const SCRYPT_N = 16384
const SCRYPT_R = 8
const SCRYPT_P = 1
const SCRYPT_KEYLEN = 64

function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(plainPassword, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  })
  return ['scrypt', SCRYPT_N, SCRYPT_R, SCRYPT_P, salt, hash.toString('hex')].join('$')
}

async function insertViaSupabase(username, passwordHash) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return false

  const endpoint = `${url}/rest/v1/admin_users`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ username, password_hash: passwordHash, is_active: true }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Supabase insert failed (${res.status}): ${text}`)
  }

  return true
}

async function main() {
  const [,, username, password] = process.argv

  if (!username || !password) {
    console.error('Usage: node scripts/create-admin.mjs <username> <password>')
    process.exit(1)
  }

  if (username.length < 3 || username.length > 50 || !/^[a-z0-9._-]+$/i.test(username)) {
    console.error('Username must be 3-50 chars, only letters, digits, dot, dash, underscore.')
    process.exit(1)
  }

  if (password.length < 10) {
    console.error('Password must be at least 10 characters.')
    process.exit(1)
  }

  console.log(`\nGenerating scrypt hash for "${username}"…`)
  const hash = hashPassword(password)
  console.log('\n✓ Password hash generated.\n')

  const supabaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (supabaseConfigured) {
    console.log('Supabase credentials detected — inserting user directly…')
    try {
      await insertViaSupabase(username.toLowerCase(), hash)
      console.log(`\n✓ Admin user "${username.toLowerCase()}" created in Supabase.\n`)
    } catch (err) {
      console.error(`\n✗ Insert failed: ${err.message}`)
      console.log('\nFallback — run the SQL below manually in the Supabase SQL editor:\n')
      printSql(username, hash)
      process.exit(1)
    }
  } else {
    console.log('No Supabase credentials found in env — output SQL for manual execution:\n')
    printSql(username, hash)
  }
}

function printSql(username, hash) {
  const safeName = username.toLowerCase().replace(/'/g, "''")
  const safeHash = hash.replace(/'/g, "''")
  console.log('-- Run in Supabase SQL editor (Dashboard → SQL Editor):')
  console.log(`INSERT INTO admin_users (username, password_hash, is_active)`)
  console.log(`VALUES ('${safeName}', '${safeHash}', true);`)
  console.log('')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
