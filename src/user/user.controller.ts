import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel, Prisma } from '@prisma/client';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    return this.userService.user({ id });
  }

  @Get('users')
  async getAllUsers(
    @Body()
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UserWhereUniqueInput;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
    },
  ): Promise<UserModel[]> {
    return this.userService.users(params);
  }

  @Post('user')
  async signupUser(
    @Body() userData: { username: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
