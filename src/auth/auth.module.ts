import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JWTConfig } from 'src/config/jwt.config';

@Module({
    imports: [
        PassportModule,
        ClientsModule.register([{ 
            name: 'USER_CLIENT', 
            transport: Transport.REDIS,
            options : {
              url: 'redis://redis:6379'
            }
        }]), 
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JWTConfig,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, ConfigService]
})

export class AuthModule {}
