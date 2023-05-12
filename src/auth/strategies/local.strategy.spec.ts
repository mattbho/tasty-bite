import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import { LocalStrategy } from './local.strategy';
import { createMock } from '@golevelup/ts-jest';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let mockedAuthService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStrategy],
    })
      .useMocker((token) => {
        if (Object.is(token, AuthService)) {
          return createMock<AuthService>();
        }
      })
      .compile();

    strategy = module.get<LocalStrategy, jest.Mocked<LocalStrategy>>(
      LocalStrategy,
    );
    mockedAuthService = module.get<AuthService, jest.Mocked<AuthService>>(
      AuthService,
    );
  });

  it('should return user if validation succeeds', async () => {
    const user = {
      id: '39cd7d68-f190-49f0-958d-8705024115ea',
      username: 'username',
      email: 'contact@mattbho.com',
    };
    mockedAuthService.validateUser.mockResolvedValueOnce(user);

    const result = await strategy.validate('username', 'password');

    expect(result).toEqual({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  });

  it('should throw UnauthorizedException if validation fails', async () => {
    mockedAuthService.validateUser.mockResolvedValueOnce(null);

    await expect(strategy.validate('username', 'password')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
