import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../providers/auth.service';
import { User } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(() => ({ access_token: 'test_token' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return an access token when the user is authenticated', async () => {
      const mockUser: Omit<User, 'password'> = {
        id: 'test-id',
        username: 'test-username',
        email: 'test-email@example.com',
      };
      const req = { user: mockUser };
      const result = await controller.login(req);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ access_token: 'test_token' });
    });
  });
});
