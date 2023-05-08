import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: Omit<User, 'password'> }) {
    return this.authService.login(req.user);
  }
}
