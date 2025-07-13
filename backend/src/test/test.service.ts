import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from './test.entity';

@Injectable()
export class TestService implements OnModuleInit {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepo: Repository<TestEntity>,
  ) {}

  async onModuleInit() {
    const record = this.testRepo.create({ message: 'Hello from DB!' });
    await this.testRepo.save(record);
    console.log('✅ Record saved to DB');
  }
}
