import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HotPostsService } from 'src/hot-posts/services/hot-posts.service';
import { MentorBoardHotPost } from '../entities/mentor-board-hot-post.entity';

@ApiTags('mentor-board-hot-posts')
@Controller('mentorBoard/hot-posts')
export class MentorBoardHotPostsController {
  constructor(
    private readonly hotPostsService: HotPostsService<MentorBoardHotPost>,
  ) {}

  @Get()
  findAllMentorBoardHotPosts() {
    return this.hotPostsService.findAllHotPosts();
  }
}
