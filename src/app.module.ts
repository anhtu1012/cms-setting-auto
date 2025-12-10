import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DynamicCmsModule } from './modules/dynamic-cms/dynamic-cms.module';
import { TierModule } from './common/tier/tier.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/cms-setting-auto',
    ),
    AuthModule,
    UsersModule,
    TierModule,
    DynamicCmsModule, //Luôn luôn đặt cuối cùng để tránh lỗi phụ thuộc
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
