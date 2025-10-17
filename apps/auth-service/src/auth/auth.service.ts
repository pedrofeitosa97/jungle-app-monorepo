import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  ClientProxyFactory,
  Transport,
  ClientOptions,
} from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private client = ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'auth_queue',
    },
  } as ClientOptions);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, username: string, password: string) {
    const user = await this.usersService.create(email, username, password);
    this.client.emit('user_registered', {
      id: user.id,
      username: user.username,
    });
    return user;
  }

  async login(username: string, password: string) {
    const user = await this.usersService.validateUser(username, password);
    if (!user) return null;
    const payload = { sub: user.id, username: user.username };
    return { access_token: this.jwtService.sign(payload) };
  }
}
