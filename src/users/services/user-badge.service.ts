import { Injectable } from '@nestjs/common';
import { UserBadgeRepository } from '../repositories/user-badge.repository';

@Injectable()
export class UserBadgeService {
  constructor(private readonly userBadgeRepository: UserBadgeRepository) {}
}
