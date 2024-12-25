import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

export async function middleware(request: NextRequest) {

    // const { pathname, method } = request.nextUrl
    //
    // // 允许所有GET请求通过
    // if (method === 'GET') {
    //     return NextResponse.next()
    // }

    if (request.nextUrl.pathname.startsWith('/my')) {
        const token = await getToken({req: request});
        if (!token) {
            const returnUrl = new URL('/', request.url);
            returnUrl.searchParams.set('no-auth', 'true');
            return NextResponse.redirect(returnUrl);
        }
        if (request.nextUrl.pathname === '/my') {
            return NextResponse.redirect(new URL('/my/article', request.url))
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

export const config = {matcher: ['/my/:path*', '/admin/:path*', '/api/my/:path*']}