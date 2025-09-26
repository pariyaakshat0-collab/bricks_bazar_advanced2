import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';

export function withAuth(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      const auth = getAuthFromRequest(request);
      
      if (!auth) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid or missing token' },
          { status: 401 }
        );
      }

      // Add user info to request for use in handlers
      (request as any).user = auth;
      
      return await handler(request);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

export function withRole(allowedRoles: string[]) {
  return (handler: (request: NextRequest) => Promise<NextResponse>) => {
    return async (request: NextRequest) => {
      try {
        const auth = getAuthFromRequest(request);
        
        if (!auth) {
          return NextResponse.json(
            { error: 'Unauthorized - Invalid or missing token' },
            { status: 401 }
          );
        }

        if (!allowedRoles.includes(auth.role)) {
          return NextResponse.json(
            { error: 'Forbidden - Insufficient permissions' },
            { status: 403 }
          );
        }

        // Add user info to request for use in handlers
        (request as any).user = auth;
        
        return await handler(request);
      } catch (error) {
        console.error('Role middleware error:', error);
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 }
        );
      }
    };
  };
}