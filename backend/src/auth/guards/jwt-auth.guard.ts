import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    // In real app, this validates Supabase JWT and injects user object
    request.user = {
      id: 'uuid-1234',
      email: 'user@mmholiday.com',
      role: 'Admin' // Default mock
    };
    
    return true;
  }
}
