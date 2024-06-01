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

  it('throws if user login with invalid email', async () => {
    await expect(service.login('foo@gmail.com', 'bar')).rejects.toThrowError(
      'Email tidak terdaftar',
    );
  });

  it('throws if user login with invalid password', async () => {
    fakeUsersService.findAll = () => {
      return Promise.resolve([
        { id: 1, name: 'foo', email: 'bar@gmail', password: 'baz' } as User,
      ]);
    };

    await expect(service.login('bar@gmail', 'bar')).rejects.toThrowError(
      'Password salah',
    );
  });

  it('login success', async () => {
    fakeUsersService.findAll = () => {
      return Promise.resolve([
        {
          id: 1,
          name: 'foo',
          email: 'bar@gmail',
          password:
            'd8082762ce875517.f158da58bcff40711db2cb2ad59ab6e7cce3ffc9730fde3261cc8de302bf214331f0296b131751b038ceaff3de5d59ba2b514625c22a4ee17297333c6245601e',
        } as User,
      ]);
    };

    const user = await service.login('bar@gmail', 'baz');
    expect(user).toBeDefined();
  });
});
