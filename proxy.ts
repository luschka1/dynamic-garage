import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/forgot-password')

  const isSharePage = request.nextUrl.pathname.startsWith('/share')
  const isGalleryPage = request.nextUrl.pathname.startsWith('/gallery')
  const isContactPage = request.nextUrl.pathname.startsWith('/contact')
  const isGaragePage = request.nextUrl.pathname.startsWith('/garage')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')
  const isEarlyAccess = request.nextUrl.pathname.startsWith('/early-access')
  const isJoinPage    = request.nextUrl.pathname.startsWith('/join')
  const isStaticPage = request.nextUrl.pathname.startsWith('/privacy') || request.nextUrl.pathname.startsWith('/terms') || request.nextUrl.pathname.startsWith('/monitoring')
  const isHelpPage = request.nextUrl.pathname.startsWith('/help')
  const isPublicPage = request.nextUrl.pathname === '/' || isAuthPage || isSharePage || isGalleryPage || isContactPage || isGaragePage || isApiRoute || isEarlyAccess || isStaticPage || isJoinPage || isHelpPage

  if (!user && !isPublicPage) {
    const url = request.nextUrl.clone()
    url.searchParams.set('next', request.nextUrl.pathname)
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
