import { Injectable } from '@nestjs/common';
import { LikesService } from 'src/like/services/likes.service';
import { MentorBoardLike } from '../entities/mentor-board-like.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class MentorBoardLikeRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly likesService: LikesService<MentorBoardLike>,
  ) {}
}
