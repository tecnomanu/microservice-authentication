import { Inject, Injectable, LiteralObject, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { compareSync } from 'bcrypt';
import { lastValueFrom, Observable, timeout } from 'rxjs';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        @Inject('USER_CLIENT')
        private readonly client: ClientProxy,
        private readonly jwtService: JwtService) { }

    async validateUser(email: string, password: string): Promise<any> {
        try {
            await this.client.connect();
            const getClient = this.client.send({ role: 'user', cmd: 'get' }, { email })
            .pipe(timeout(5000));

            const user = await lastValueFrom(getClient);

            if(user && compareSync(password, user?.password)){
                const {password, ...payload } = user;
                return payload;
            }

            return null;
        } catch (e) {
            Logger.log(e);
            throw e;
        }
    }

    login(user:LiteralObject){
        const payload = { user, sub: user.id };

        return {
            user,
            accessToken: this.jwtService.sign(payload)
        };
    }

    validateToken(jwt: string) {
        return this.jwtService.verify(jwt);
    }
}
