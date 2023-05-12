import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './providers/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
