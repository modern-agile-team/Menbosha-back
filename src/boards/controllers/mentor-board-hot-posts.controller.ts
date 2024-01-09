import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MentorBoardHotPostsService } from '../services/mentor-board-hot-posts.service';

@ApiTags('mentor-board-hot-posts')
@Controller('mentorBoard/hot-posts')
export class MentorBoardHotPostsController {
  constructor(
    private readonly mentorBoardHotPostsService: MentorBoardHotPostsService,
  ) {}

  @Get()
  findAllMentorBoardHotPosts() {
    return this.mentorBoardHotPostsService.findAllMentorBoardHotPosts();
  }
}
