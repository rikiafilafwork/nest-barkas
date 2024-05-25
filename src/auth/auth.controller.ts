import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from '../users/dtos/user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../auth/dtos/login-user.dto';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/register')
  async register(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.register(
      body.name,
      body.email,
      body.password,
    );
    session.userId = user.id;
    return user;
  }

  @Post('/login')
  async login(@Body() body: LoginUserDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/logout')
  logout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/cookie')
  async getAuthCookie(@Session() session: any) {
    const user = await this.usersService.findOne(session.userId);
    return user;
  }
}
