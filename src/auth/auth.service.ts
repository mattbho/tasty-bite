import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { hashPassword, omitKey } from 'src/shared';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const hashedPassword = await hashPassword(password);
    const user = await this.userService.user({ username });
    if (user && user.password === hashedPassword) {
      return omitKey(user, ['password']);
    }
    return null;
  }
}
