import { createClient } from "@supabase/supabase-js"

let browserClient: ReturnType<typeof createClient> | null = null

export function getBrowserClient() {
  // Only initialize if we have valid env vars
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If we already have a client, return it
  if (browserClient) {
    return browserClient
  }

  // Guard against build-time or missing environment variables
  if (!url || !key) {
    console.error('❌ Supabase env vars not found. URL:', url ? '✓' : '✗', 'Key:', key ? '✓' : '✗')
    return null
  }

  if (typeof url !== 'string' || typeof key !== 'string') {
    console.error('❌ Supabase env vars are not strings')
    return null
  }

  if (!url.startsWith('http')) {
    console.error('❌ Supabase URL does not start with http:', url)
    return null
  }

  // Create and cache the client
  console.log('✓ Creating Supabase client with URL:', url.split('/').pop())
  browserClient = createClient(url, key)
  return browserClient
}
