import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './profile/entities/profile.entity';
import { WorkingExperienceModule } from './working-experience/working-experience.module';
import { WorkingExperience } from './working-experience/entities/working-experience.entity';
import { EducationModule } from './education/education.module';
import { Education } from './education/entities/education.entity';
import { SkillsetModule } from './skillset/skillset.module';
import { Skillset } from './skillset/entities/skillset.entity';


global['fetch'] = require('node-fetch');

@Module({
  imports: [
    AuthModule,
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test",
      ignoreEnvFile: process.env.NODE_ENV === "prod",
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        COGNITO_USER_POOL_ID: Joi.string(),
        COGNITO_CLIENT_ID: Joi.string(),
        COGNITO_CLIENT_SECRET: Joi.string(),
        COGNITO_REGION: Joi.string(),
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl:{rejectUnauthorized: false},
      entities: [User, Profile, WorkingExperience, Education, Skillset],
      logging: process.env.NODE_ENV !=='prod' && process.env.NODE_ENV!=='test',
      synchronize: process.env.NODE_ENV !== "prod",
    }),
    UserModule,
    ProfileModule,
    WorkingExperienceModule,
    EducationModule,
    SkillsetModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
