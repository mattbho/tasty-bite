import { Prisma } from '@prisma/client';
import { IsOptional, IsNumber } from 'class-validator';

export class FindAllUsersDto {
  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNumber()
  take?: number;

  @IsOptional()
  cursor?: Prisma.UserWhereUniqueInput;

  @IsOptional()
  where?: Prisma.UserWhereInput;

  @IsOptional()
  orderBy?: Prisma.UserOrderByWithRelationInput;
}
