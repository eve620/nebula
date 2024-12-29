import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";


// const protectedRoutes = [
//     { path: '/api/articles', methods: ['POST', 'PUT', 'DELETE'] },
//     { path: '/api/comment', methods: ['POST', 'PUT', 'DELETE'] },
// ]
export async function middleware(request: NextRequest) {
    //保护
    // const { pathname, method } = request.nextUrl
    //
    // 思路1允许所有
    // if (method === 'GET') {
    //     return NextResponse.next()
    // }
    // 2限定
    // const needsAuth = protectedRoutes.some(route =>
    //     pathname.startsWith(route.path) && route.methods.includes(method)
    // )
    //
    // if (needsAuth) {}
    if (request.nextUrl.pathname.startsWith('/api/article/comment')) {
        const token = await getToken({req: request});
        if (!token) {
            return NextResponse.json({error: '未登录'}, {status: 401})
        }
        const response = NextResponse.next()
        response.headers.set('X-User-Id', token.sub.toString())
        return response
    }

    if (request.nextUrl.pathname.startsWith('/my') || request.nextUrl.pathname.startsWith('/message')) {
        const token = await getToken({req: request});
        if (!token) {
            const returnUrl = new URL('/', request.url);
            returnUrl.searchParams.set('no-auth', 'true');
            return NextResponse.redirect(returnUrl);
        }
        if (request.nextUrl.pathname === '/my') {
            return NextResponse.redirect(new URL('/my/article', request.url))
        }
        if (request.nextUrl.pathname === '/message') {
            return NextResponse.redirect(new URL('/message/whisper', request.url))
        }
    }
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = await getToken({req: request});
        if (!token) {
            const returnUrl = new URL('/', request.url);
            returnUrl.searchParams.set('no-auth', 'true');
            return NextResponse.redirect(returnUrl);
        } else if (token.role !== "Admin") {
            const returnUrl = new URL('/', request.url);
            returnUrl.searchParams.set('no-access', 'true');
            return NextResponse.redirect(returnUrl);
        }
    }
    if (request.nextUrl.pathname.startsWith('/api/my')) {
        const token = await getToken({req: request});
        if (!token) {
            return NextResponse.json("未登录", {status: 403})
        }
    }
    return NextResponse.next()
}

export const config = {matcher: ['/my/:path*', '/admin/:path*', '/message/:path*', '/api/my/:path*', '/api/article/:path*']}