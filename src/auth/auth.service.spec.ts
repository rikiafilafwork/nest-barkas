import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      findAll: () => Promise.resolve([]),
      create: (name: string, email: string, password: string) => {
        return Promise.resolve({ id: 1, name, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const user = await service.register('foo', 'bar@gmail.com', 'baz');
    expect(user.password).not.toEqual('baz');

    expect(user.name).toBe('foo');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should fail create user with existing email', async () => {
    fakeUsersService.findAll = () => {
      return Promise.resolve([
        { id: 1, name: 'foo', email: 'bar@gmail', password: 'baz' } as User,
      ]);
    };
    await expect(
      service.register('foo', 'bar@gmail', 'baz'),
    ).rejects.toThrowError('Email sudah terdaftar');
  });
});
