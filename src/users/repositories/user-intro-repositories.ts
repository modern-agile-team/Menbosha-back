import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserIntroRepository {
  constructor(private readonly entityManager: EntityManager) {}
}
