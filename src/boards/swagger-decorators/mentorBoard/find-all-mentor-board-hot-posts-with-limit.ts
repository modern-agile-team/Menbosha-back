import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseMentorBoardHotPostsItemDto } from 'src/boards/dto/mentorBoard/response-mentor-board-hot-posts-item';

export function ApiFindAllMentorBoardHotPostsWithLimit() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 게시판 인기 글 createdAt 내림차 순으로 불러오기',
      description: 'limit로 5개만 불러 옵니다',
    }),
    ApiResponse({
      status: 200,
      description: '멘토 게시판 인기글 성공적으로 불러옴.',
      schema: {
        properties: {
          content: {
            type: 'array',
            items: {
              type: 'object',
              $ref: getSchemaPath(ResponseMentorBoardHotPostsItemDto),
            },
          },
        },
      },
    }),
    ApiExtraModels(ResponseMentorBoardHotPostsItemDto),
  );
}
