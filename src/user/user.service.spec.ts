import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UserService } from './user.service';
import { v4 as uuidv4 } from 'uuid';

const userId = uuidv4();

const userArray = [
  {
    name: 'Test User1',
    username: 'test1@test.com',
    email: 'test1@test.com',
    id: '4',
  },
  {
    name: 'Test User2',
    username: 'test2@test.com',
    email: 'test2@test.com',
    id: userId,
  },
  {
    name: 'Test User3',
    username: 'test3@test.com',
    email: 'test3@test.com',
    id: userId,
  },
];

const oneUser = userArray[0];

const db = {
  user: {
    findMany: jest.fn().mockResolvedValue(userArray),
    findUnique: jest.fn().mockResolvedValue(oneUser),
    findFirst: jest.fn().mockResolvedValue(oneUser),
    create: jest.fn().mockReturnValue(oneUser),
    update: jest.fn().mockResolvedValue(oneUser),
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
      expect(service.createUser(oneUser)).resolves.toEqual(oneUser);
    });
  });

  // although this test is passing, it is not testing if the user is updated, am I doing this correctly?
  describe('updateUser', () => {
    it('should update a user based on passed in data', async () => {
      const user = await service.updateUser({
        where: { id: '4' },
        data: {
          email: 'changedemail1@test.com',
        },
      });
      console.log(oneUser);
      expect(user).toEqual(oneUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const deletedUser = await service.deleteUser({ id: '4' });
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
