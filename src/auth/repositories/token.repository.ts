import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, EntityManager } from 'typeorm';
import { Token } from '../entities/token.entity';

@Injectable()
export class TokenRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async getUserTokens(userId: number): Promise<Token[]> {
    return await this.entityManager.find(Token, { where: { userId } });
  }

  async saveTokens(
    userId: number,
    refreshToken: string,
    socialAccessToken: string,
    socialRefreshToken: string,
  ): Promise<Token> {
    const token = new Token();
    token.userId = userId;
    token.refreshToken = refreshToken;
    token.socialAccessToken = socialAccessToken;
    token.socialRefreshToken = socialRefreshToken;

    return await this.entityManager.save(token);
  }

  async updateTokens(
    userId: number,
    refreshToken: string,
    socialAccessToken: string,
    socialRefreshToken: string,
  ): Promise<Token> {
    const token = await this.entityManager.findOne(Token, {
      where: { userId },
    });
    token.refreshToken = refreshToken;
    token.socialAccessToken = socialAccessToken;
    token.socialRefreshToken = socialRefreshToken;

    return await this.entityManager.save(token);
  }

  async deleteTokens(userId: number): Promise<Token | DeleteResult> {
    const res = await this.entityManager.delete(Token, { userId });
    if (!res.affected) {
      throw new NotFoundException('토큰을 찾을 수 없습니다.');
    }
    return res;
  }
}
