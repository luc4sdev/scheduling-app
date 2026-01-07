import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const privatePaths = ['/dashboard'];
const authPaths = ['/signin', '/signup'];

export default auth(async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const session = await auth();

    const isPrivate = privatePaths.some(route => pathname.startsWith(route));
    const isAuth = authPaths.includes(pathname);
    const isRoot = pathname === '/';

    if (!session?.user) {
        if (isPrivate || isRoot) {
            return NextResponse.redirect(new URL('/signin', request.url));
        }
        return NextResponse.next();
    }

    const userId = session.user.id;

    if (pathname.startsWith('/dashboard')) {
        const segments = pathname.split('/');
        const idInPath = segments[2] || null;

        if (idInPath !== userId) {
            return NextResponse.redirect(new URL(`/dashboard/${userId}`, request.url));
        }
    }

    if (isRoot || isAuth) {
        const redirectPath = `/dashboard/${userId}`;
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/', '/signin', '/signup', '/dashboard/:path*'],
};