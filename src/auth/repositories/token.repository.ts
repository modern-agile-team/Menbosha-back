import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, EntityManager, UpdateResult } from 'typeorm';
import { Token } from '../entities/token.entity';

@Injectable()
export class TokenRepository {
  constructor(private readonly entityManager: EntityManager) {}

  getUserToken(userId: number): Promise<Token> {
    return this.entityManager.findOne(Token, { where: { userId } });
  }

  saveTokens(
    userId: number,
    refreshToken: string,
    socialAccessToken: string,
    socialRefreshToken: string,
  ): Promise<Token> {
    return this.entityManager.save(Token, {
      userId,
      refreshToken,
      socialAccessToken,
      socialRefreshToken,
    });
  }

  updateTokens(
    userId: number,
    refreshToken: string,
    socialAccessToken: string,
    socialRefreshToken: string,
  ): Promise<UpdateResult> {
    return this.entityManager.update(
      Token,
      { userId },
      { refreshToken, socialAccessToken, socialRefreshToken },
    );
  }

  async deleteTokens(userId: number): Promise<Token | DeleteResult> {
    const res = await this.entityManager.delete(Token, { userId });
    if (!res.affected) {
      throw new NotFoundException('토큰을 찾을 수 없습니다.');
    }
    return res;
  }
}
