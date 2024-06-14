import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setup-app';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Handle register user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'foo3',
        email: 'foo3@gmail.com',
        password: 'foo',
      })
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBe('foo3');
        expect(body.email).toBe('foo3@gmail.com');
      });
  });

  it('Handle logged in user after register', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'foo2',
        email: 'foo2@gmail.com',
        password: 'foo',
      })
      .expect(201);

    const cookie = response.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/cookie')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toBe('foo2@gmail.com');
  });
});
