import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Get('permissions')
  @UseGuards(JwtAuthGuard)
  getMyPermissions(@Req() req: any) {
    return this.authService.getMyPermissions(req.user.id, req.user.role);
  }
}
