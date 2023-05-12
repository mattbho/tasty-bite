import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from '../../user/providers/user.service';
import { AuthService } from './auth.service';
import { hashPassword } from '../../shared';
import { v4 as uuidv4 } from 'uuid';

describe('AuthService', () => {
  let service: AuthService;
  let mockedUserService: jest.Mocked<UserService>;
  let mockedJwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (Object.is(token, UserService)) {
          return createMock<UserService>();
        }
        if (Object.is(token, JwtService)) {
          return createMock<JwtService>();
        }
      })
      .compile();

    service = module.get(AuthService);
    mockedUserService = module.get<UserService, jest.Mocked<UserService>>(
      UserService,
    );
    mockedJwtService = module.get<JwtService, jest.Mocked<JwtService>>(
      JwtService,
    );
  });

  describe('AuthService', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should be an instanceof AuthService', () => {
      expect(service).toBeInstanceOf(AuthService);
    });

    it('should validate an existing user', async () => {
      const uuid = uuidv4();
      const password = 'somePassword';
      const hashedPassword = await hashPassword(password);

      const user = {
        id: uuid,
        username: 'username',
        password: hashedPassword,
        email: 'contact@mattbho.com',
      };

      mockedUserService.user.mockResolvedValueOnce(user);

      const validatedUser = await service.validateUser(user.username, password);

      expect(validatedUser).toHaveProperty('id', user.id);
      expect(validatedUser).toHaveProperty('email', user.email);
      expect(validatedUser).toHaveProperty('username', user.username);
      expect(validatedUser).not.toHaveProperty('password');
      expect(validatedUser).not.toHaveProperty('someRandomKey');
    });

    it('should return null for a user not found', async () => {
      const username = 'notfound';
      const password = 'something';

      mockedUserService.user.mockResolvedValueOnce(null);

      const nullUser = await service.validateUser(username, password);
      expect(nullUser).toEqual(null);
    });

    it('should return null for an incorrect password', async () => {
      const uuid = uuidv4();
      const hashedPassword = await hashPassword('some password');

      const user = {
        id: uuid,
        username: 'username',
        password: hashedPassword,
        email: 'contact@mattbho.com',
      };

      mockedUserService.user.mockResolvedValueOnce(user);

      const nullUser = await service.validateUser(
        user.username,
        'wrong-password',
      );
      expect(nullUser).toEqual(null);
    });
  });

  it('should issue a jwt token', async () => {
    const user = {
      username: 'username',
      id: uuidv4(),
      email: 'someEmail@gmail.com',
    };
    mockedJwtService.sign.mockReturnValueOnce('some-value');
    const result = await service.login(user);

    expect(result).toHaveProperty('access_token', 'some-value');
  });
});
