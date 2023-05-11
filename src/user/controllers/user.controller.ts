import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { User } from '@prisma/client';
import { CreateUserDto, FindAllUsersDto, UpdateUserDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { hashPassword, omitKey } from '../../shared';

type UserResponse = Omit<User, 'password'>;

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<UserResponse> {
    const user = await this.userService.user({ id });
    return omitKey(user, ['password']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers(
    @Body()
    params: FindAllUsersDto,
  ): Promise<UserResponse[]> {
    return this.userService.users(params);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
