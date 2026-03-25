// import { NextResponse } from "next/server";

// export function middleware() {
//     // retrieve the current response
//     const res = NextResponse.next()

//     // add the CORS headers to the response
//     res.headers.append('Access-Control-Allow-Credentials', "true")
//     res.headers.append('Access-Control-Allow-Origin', '*') // replace this your actual origin
//     res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
//     res.headers.append(
//         'Access-Control-Allow-Headers',
//         'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//     )

//     return res
// }

// // specify the path regex to apply the middleware to
// export const config = {
//     matcher: '/api/:path*',
// }
import { NextResponse } from "next/server";

export function middleware(request) {
    // Handle OPTIONS request (CORS preflight)
    if (request.method === 'OPTIONS') {
        const res = new NextResponse(null, { status: 200 });
        res.headers.append('Access-Control-Allow-Credentials', "true");
        res.headers.append('Access-Control-Allow-Origin', '*');
        res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
        res.headers.append(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
        );
        return res;
    }

    // retrieve the current response
    const res = NextResponse.next();

    // add the CORS headers to the response
    res.headers.append('Access-Control-Allow-Credentials', "true");
    res.headers.append('Access-Control-Allow-Origin', '*');
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    return res;
}

// specify the path regex to apply the middleware to
export const config = {
    matcher: '/api/:path*',
};