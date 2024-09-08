import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LinksModule } from './links/links.module';
import { AppController } from './app/app.controller';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, LinksModule],
  controllers: [AppController],
})
export class AppModule {}
