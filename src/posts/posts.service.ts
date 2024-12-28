import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  create(title: string, content: string, userId: number): Promise<Post> {
    const post = this.postRepository.create({
      title,
      content,
      user: { id: userId },
    });
    return this.postRepository.save(post);
  }

  findAll(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['user'] });
  }

  findOne(id: number): Promise<Post> {
    return this.postRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async update(id: number, title: string, content: string): Promise<Post> {
    await this.postRepository.update(id, { title, content });
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.postRepository.delete(id);
    return { message: 'Post has been successfully deleted' };
  }
}
