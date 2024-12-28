import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['posts'] });
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations: ['posts'] });
  }

  async update(
    id: number,
    username: string,
    password: string,
    isActive: boolean,
  ): Promise<User> {
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const updatePayload: Partial<User> = { username, isActive };
    if (hashedPassword) {
      updatePayload.password = hashedPassword;
    }

    await this.userRepository.update(id, updatePayload);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.userRepository.delete(id);
    return { message: 'User has been successfully deleted.' };
  }
}
