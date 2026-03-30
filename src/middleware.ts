import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isApiAuthRoute = pathname.startsWith('/api/auth');
  
  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  
  const isAuthPage = pathname.startsWith('/login') ||
                     pathname.startsWith('/register') ||
                     pathname.startsWith('/reset-password');
  
  const isPublicPage = pathname.startsWith('/_next') ||
                       pathname.startsWith('/_vercel') ||
                       pathname.includes('.');

  const sfAccess = request.cookies.get('sf_access')?.value;
  const hasAccess = sfAccess === 'granted';

  if (pathname === '/' || pathname === '') {
    if (hasAccess) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (pathname === '/login') {
    if (hasAccess) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!isPublicPage && !hasAccess) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (hasAccess && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
