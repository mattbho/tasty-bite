import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const user1Id = uuidv4();
const user2Id = uuidv4();

describe('AppController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            user: jest.fn().mockImplementation(({ id }) =>
              Promise.resolve({
                id: id,
                username: 'johndoe',
                email: 'johndoe@gmail.com',
              }),
            ),
            users: jest.fn().mockImplementation(({}) =>
              Promise.resolve([
                {
                  username: 'johndoe',
                  email: 'johndoe@gmail.com',
                  id: user1Id,
                },
                {
                  username: 'janedoe',
                  email: 'janedoe@gmail.com',
                  id: user2Id,
                },
              ]),
            ),
            updateUser: jest
              .fn()
              .mockImplementation(
                (params: {
                  where: Prisma.UserWhereUniqueInput;
                  data: Prisma.UserUpdateInput;
                }) =>
                  Promise.resolve({
                    id: params.where.id,
                    username: params.data.username,
                    email: 'johndoe@gmail.com',
                  }),
              ),
            createUser: jest
              .fn()
              .mockImplementation((data: Prisma.UserCreateInput) =>
                Promise.resolve({
                  id: user1Id,
                  username: data.username,
                  email: data.email,
                  password: data.password,
                }),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a single user', async () => {
      const user = {
        username: 'johndoe',
        email: 'johndoe@gmail.com',
        id: 'some id',
      };
      const getUser = await controller.getUserById('some id');
      expect(getUser).toEqual(user);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        {
          username: 'johndoe',
          email: 'johndoe@gmail.com',
          id: user1Id,
        },
        {
          username: 'janedoe',
          email: 'janedoe@gmail.com',
          id: user2Id,
        },
      ];
      const allUsers = await controller.getAllUsers({});
      expect(allUsers).toEqual(users);
    });
  });

  describe('updateUsers', () => {
    it('should update user details', async () => {
      const updateParams = { username: 'foo bar' };
      const updateUser = await controller.updateUser(user1Id, {
        ...updateParams,
      });
      expect(updateUser).toEqual({
        id: user1Id,
        username: 'foo bar',
        email: 'johndoe@gmail.com',
      });
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUser = await controller.signupUser({
        username: 'jasmine',
        email: 'jasmine@jasmine.com',
        password: 'some password',
      });
      expect(createUser).toEqual({
        id: user1Id,
        username: 'jasmine',
        email: 'jasmine@jasmine.com',
        password: 'some password',
      });
    });
  });
});
