import { Injectable } from '@nestjs/common';
import { HotPostsService } from 'src/hot-posts/services/hot-posts.service';
import { MentorBoardHotPost } from '../entities/mentor-board-hot-post.entity';

@Injectable()
export class MentorBoardHotPostsService {
  constructor(
    private readonly hotPostsService: HotPostsService<MentorBoardHotPost>,
  ) {}

  findAllMentorBoardHotPosts() {
    return this.hotPostsService.findAllHotPosts({
      select: {
        id: true,
        mentorBoard: {
          id: true,
          userId: true,
          user: {
            name: true,
            userImage: {
              imageUrl: true,
            },
          },
          mentorBoardImages: {
            imageUrl: true,
          },
        },
      },
      relations: {
        mentorBoard: {
          user: {
            userImage: true,
          },
          mentorBoardImages: true,
        },
      },
    });
  }
}
