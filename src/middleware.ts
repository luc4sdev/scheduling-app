import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const privatePaths = ['/dashboard', '/admin'];
const authPaths = ['/signin', '/signup'];
const adminPaths = ['/admin'];

export default auth(async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const session = await auth();

    const isPrivate = privatePaths.some(route => pathname.startsWith(route));
    const isAuth = authPaths.includes(pathname);
    const isRoot = pathname === '/';
    const isAdminRoute = adminPaths.some(route => pathname.startsWith(route));

    if (!session?.user) {
        if (isPrivate || isRoot) {
            return NextResponse.redirect(new URL('/signin', request.url));
        }
        return NextResponse.next();
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    if (isAdminRoute && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL(`/dashboard/${userId}`, request.url));
    }

    if (pathname.startsWith('/dashboard')) {
        const segments = pathname.split('/');
        const idInPath = segments[2] || null;

        if (idInPath !== userId) {
            return NextResponse.redirect(new URL(`/dashboard/${userId}`, request.url));
        }
    }

    if (isRoot || isAuth) {
        const redirectPath = userRole === 'ADMIN'
            ? '/admin'
            : `/dashboard/${userId}`;
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    if (userRole === 'ADMIN' && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/', '/signin', '/signup', '/dashboard/:path*', '/admin/:path*'],
};