import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const host = request.headers.get('host')
    
    // Bloquer les tentatives d'accès aux métadonnées
    if (host?.includes('169.254.169.254')) {
        return new NextResponse(null, {
            status: 403,
            statusText: 'Forbidden'
        })
    }

    // Valider le host header
    const validHosts = ['votre-domaine.com', 'www.votre-domaine.com']
    if (!host || !validHosts.includes(host)) {
        return new NextResponse(null, {
            status: 400,
            statusText: 'Bad Request'
        })
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/:path*'
} 