import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermission = this.reflector.getAllAndOverride<{module: string, action: string}>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 1. Check if user is 'Admin' (Legacy behavior: Admin gets all pass)
    if (user.role === 'Admin') {
      return true;
    }

    // 2. Check Roles explicitly if @Roles() is used
    if (requiredRoles) {
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException(`Access Denied: Requires one of roles: ${requiredRoles.join(', ')}`);
      }
    }

    // 3. Check specific permissions if @RequirePermissions() is used
    if (requiredPermission) {
      const hasPermission = await this.authService.checkUserPermission(user.id, user.role, requiredPermission.module, requiredPermission.action);
      if (!hasPermission) {
        throw new ForbiddenException(`Access Denied: You do not have '${requiredPermission.action}' permission for '${requiredPermission.module}'`);
      }
    }

    return true;
  }
}
