import { redirect } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { sanitizeInput } from '@/lib/utils'

interface Props {
  params: Promise<{
    shortCode: string
  }>
}

export default async function RedirectPage({ params }: Props) {
  // ✅ AWAIT params dulu!
  const { shortCode: rawShortCode } = await params
  const shortCode = sanitizeInput(rawShortCode)

  console.log('==================================================')
  console.log(`🔍 Redirect Request for: "${shortCode}"`)
  console.log('==================================================')

  // ✅ TEST 1: Direct Supabase query (bypass db helper)
  console.log('🧪 Testing direct Supabase query...')
  
  const { data: directResult, error: directError } = await supabase
    .from('urls_linkq')
    .select('*')
    .eq('short_code', shortCode)
    .maybeSingle()

  console.log('📊 Direct query result:', directResult)
  console.log('📊 Direct query error:', directError)

  if (!directResult) {
    console.log(`❌ Direct query: URL not found for "${shortCode}"`)
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-2">
            Link tidak ditemukan
          </p>
          <p className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-2 rounded mb-8">
            /{shortCode}
          </p>
          <div className="text-xs text-gray-400 mb-4">
            Debug: Searched for &quot;{shortCode}&quot; in database
          </div>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  console.log(`✅ Found URL: ${directResult.original_url}`)
  console.log(`📈 Current clicks: ${directResult.clicks}`)

  // Increment clicks
  const newClickCount = (directResult.clicks || 0) + 1
  
  const { error: updateError } = await supabase
    .from('urls_linkq')
    .update({ clicks: newClickCount })
    .eq('id', directResult.id)

  if (updateError) {
    console.error('⚠️  Failed to increment clicks:', updateError)
  } else {
    console.log(`📈 Clicks updated to: ${newClickCount}`)
  }

  // Redirect
  console.log(`🔄 Redirecting to: ${directResult.original_url}`)
  console.log('==================================================')
  
  redirect(directResult.original_url)
}