import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const privatePaths = ['/dashboard'];
const authPaths = ['/signin', '/signin/admin', '/signup'];

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

    const user = session.user;
    const userId = user.id;
    const isAdmin = user.role === 'ADMIN';
    const permissions = user.permissions || [];

    if (isRoot || isAuth) {
        return NextResponse.redirect(new URL(`/dashboard/${userId}`, request.url));
    }

    if (pathname.startsWith('/dashboard')) {
        const segments = pathname.split('/');
        const idInPath = segments[2]; 

        if (idInPath && idInPath !== userId) {
            const newPath = pathname.replace(idInPath, userId);
            return NextResponse.redirect(new URL(newPath, request.url));
        }

        if (!isAdmin) {
            if (pathname.includes('/logs')) {
                if (!permissions.includes('LOGS')) {
                    return NextResponse.redirect(new URL(`/dashboard/${userId}`, request.url));
                }
            }
            
            else if (pathname.includes('/users')) {
                return NextResponse.redirect(new URL(`/dashboard/${userId}`, request.url));
            }

            else if (
                !pathname.includes('/profile') && 
                !pathname.includes('/users') && 
                !pathname.includes('/clients') && 
                !pathname.includes('/logs')
            ) {
                if (!permissions.includes('APPOINTMENTS')) {
                    return NextResponse.redirect(new URL(`/dashboard/${userId}/profile`, request.url));
                }
            }
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};