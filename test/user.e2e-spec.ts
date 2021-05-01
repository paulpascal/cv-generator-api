import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { User } from 'src/user/entities/user.entity';
import { getConnection, getRepository, Repository } from 'typeorm';

describe('User module (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let jwtToken: string;

  const baseTest = () => request(app.getHttpServer()).post('/auth');
  const publicTest = (query: object) => baseTest().send(query);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });

  describe('createAccount', () => {
    it('should create an account', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'testUser@testUser.com',
          name: 'testUser@testUser.com',
          password: 'P4ssWord1!',
        })
        .expect(201);
    });
  });
});
