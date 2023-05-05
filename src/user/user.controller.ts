import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { CreateUserDto, FindAllUsersDto, UpdateUserDto } from './dto';
import { hashPassword } from 'src/shared';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    return this.userService.user({ id });
  }

  @Get('users')
  async getAllUsers(
    @Body()
    params: FindAllUsersDto,
  ): Promise<UserModel[]> {
    return this.userService.users(params);
  }

  @Post('user')
  async signupUser(
    @Body() userParams: CreateUserDto,
  ): Promise<Omit<UserModel, 'password'>> {
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
  ): Promise<UserModel> {
    return this.userService.updateUser({
      where: { id },
      data: { username: params.username },
    });
  }
}
