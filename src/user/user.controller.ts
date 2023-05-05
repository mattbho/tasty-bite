import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { CreateUserDto, FindAllUsersDto, UpdateUserDto } from './dto';

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
  async signupUser(@Body() userData: CreateUserDto): Promise<UserModel> {
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
