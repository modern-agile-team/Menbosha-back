import { Injectable } from '@nestjs/common';
import { TotalCountRepository } from '../repositories/total-count.repository';

@Injectable()
export class TotalCountService {
  constructor(private readonly totalCountRepository: TotalCountRepository) {}

  async createTotalCount(userId: number) {
    await this.totalCountRepository.createTotalCount(userId);
  }
}
