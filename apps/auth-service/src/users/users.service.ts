import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(email: string, username: string, password: string) {
    const hashedPassword = await hash(password, 10);
    const user = this.repo.create({
      email,
      username,
      password: hashedPassword,
    });
    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  async findByUsername(username: string) {
    return this.repo.findOneBy({ username });
  }

  async validateUser(username: string, password: string) {
    const user = await this.findByUsername(username);
    if (!user) return null;

    const isValid = await compare(password, user.password);
    return isValid ? user : null;
  }
}
