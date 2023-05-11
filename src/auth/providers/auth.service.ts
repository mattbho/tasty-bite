import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/providers/user.service';
import { verifyPassword, hashPassword, omitKey } from '../../shared';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const hashedPassword = await hashPassword(password);
    const user = await this.userService.user({ username });
    if (user && verifyPassword(hashedPassword, user.password)) {
      return omitKey(user, ['password']);
    }
    return null;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
