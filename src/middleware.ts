import { type NextRequest, NextResponse } from 'next/server'

export default async function ensureAuthMiddleware(request: NextRequest) {
  const isLoggedUser = Boolean(request.cookies.get('jwt')?.value)
  const currentPath = request.nextUrl.pathname

  if (currentPath.includes('/api')) {
    return NextResponse.next()
  }

  const isPublicRoute = currentPath === '/' || ['terms'].includes(currentPath)

  const shouldRedirectToAuth = !isLoggedUser && !isPublicRoute

  const shouldRedirectToHome = isLoggedUser && currentPath === '/'

  const url = request.nextUrl.clone()

  if (shouldRedirectToHome) {
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  if (shouldRedirectToAuth) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
