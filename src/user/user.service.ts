import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User as UserModel, Prisma } from '@prisma/client';

type UserRecord = Omit<UserModel, 'password'>;

const selectQuery = {
  id: true,
  username: true,
  email: true,
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserModel> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<UserRecord[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: selectQuery,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<UserRecord> {
    return this.prisma.user.create({
      data,
      select: selectQuery,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UserRecord> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
      select: selectQuery,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<UserRecord> {
    return this.prisma.user.delete({
      where,
      select: selectQuery,
    });
  }
}
