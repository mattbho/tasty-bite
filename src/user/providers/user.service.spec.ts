import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { UserService } from '../providers/user.service';
import { v4 as uuidv4 } from 'uuid';

const userId1 = uuidv4();
const userId2 = uuidv4();
const userId3 = uuidv4();

const userArray = [
  {
    username: 'test1@test.com',
    email: 'test1@test.com',
    id: userId1,
  },
  {
    username: 'test2@test.com',
    email: 'test2@test.com',
    id: userId2,
  },
  {
    username: 'test3@test.com',
    email: 'test3@test.com',
    id: userId3,
  },
];

const oneUser = userArray[0];

const db = {
  user: {
    findMany: jest.fn().mockResolvedValue(userArray),
    findUnique: jest.fn().mockResolvedValue(oneUser),
    findFirst: jest.fn().mockResolvedValue(oneUser),
    create: jest.fn().mockImplementation(({ data }) =>
      Promise.resolve({
        id: data.id,
        username: data.username,
        email: data.email,
      }),
    ),
    update: jest.fn().mockImplementation(({ data, where }) => {
      const user = userArray.find((user) => user.id === where.id);
      const updatedUser = {
        ...user,
        email: data.email,
      };
      return Promise.resolve(updatedUser);
    }),
    delete: jest.fn().mockResolvedValue(oneUser),
  },
};

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user', () => {
    it('should return a user or null', async () => {
      const user = await service.user(oneUser);
      expect(user).toEqual(oneUser);
    });
  });

  describe('users', () => {
    it('should get all users', async () => {
      const users = await service.users({});
      expect(users).toEqual(userArray);
    });
  });

  describe('createUser', () => {
    it('should successfully insert a user', () => {
      const userParams = {
        ...oneUser,
        password: 'password',
      };
      expect(service.createUser(userParams)).resolves.toEqual(oneUser);
    });
  });

  describe('updateUser', () => {
    it('should update a user based on passed in data', async () => {
      const user = await service.updateUser({
        where: { id: userId1 },
        data: {
          email: 'changedemail1@test.com',
        },
      });
      expect(user).toEqual({
        ...oneUser,
        email: 'changedemail1@test.com',
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const deletedUser = await service.deleteUser({ id: userId1 });
      expect(deletedUser).toEqual(oneUser);
    });

    it('should return an error message', async () => {
      jest
        .spyOn(prisma.user, 'delete')
        .mockRejectedValueOnce(new Error('Bad Delete Method.'));
      await expect(service.deleteUser({ id: '5' })).rejects.toThrow(
        'Bad Delete Method.',
      );
    });
  });
});
