import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDto, FindAllUsersDto, UpdateUserDto } from './dto';
import { hashPassword, omitKey } from 'src/shared';

type UserResponse = Omit<User, 'password'>;

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<UserResponse> {
    const user = await this.userService.user({ id });
    return omitKey(user, ['password']);
  }

  @Get('users')
  async getAllUsers(
    @Body()
    params: FindAllUsersDto,
  ): Promise<UserResponse[]> {
    return this.userService.users(params);
  }

  @Post('user')
  async signupUser(@Body() userParams: CreateUserDto): Promise<UserResponse> {
    const { password: unHashedPassword, ...params } = userParams;
    const hashedPassword = await hashPassword(unHashedPassword);
    const userData = {
      ...params,
      password: hashedPassword,
    };
    return this.userService.createUser(userData);
  }

  @Patch('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() params: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.userService.updateUser({
      where: { id },
      data: { username: params.username },
    });
  }
}
