import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      findAll: (email: string) => {
        const user = users.filter((user) => user.email === email);
        return Promise.resolve(user);
      },
      create: (name: string, email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 999999), name, email, password } as User;
        users.push(user);
        return Promise.resolve(user);
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
    await service.register('foo', 'bar@gmail', 'baz');
    await expect(
      service.register('foo', 'bar@gmail', 'baz'),
    ).rejects.toThrowError('Email sudah terdaftar');
  });

  it('throws if user login with invalid email', async () => {
    await expect(service.login('foo@gmail.com', 'bar')).rejects.toThrowError(
      'Email tidak terdaftar',
    );
  });

  it('throws if user login with invalid password', async () => {
    await service.register('foo', 'bar@gmail', 'baz123');

    await expect(service.login('bar@gmail', 'bar')).rejects.toThrowError(
      'Password salah',
    );
  });

  it('login success', async () => {
    await service.register('foo', 'bar@gmail', 'baz');
    const user = await service.login('bar@gmail', 'baz');
    expect(user).toBeDefined();
  });
});
