import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { MentorPaginationResponseDto } from '@src/mentors/dtos/mentors-pagination-response.dto';

export function ApiFindAllMentorsAndCount() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 리스트 pagination',
      description: `page및 limit, 정렬할 필드, 오름차순 내림차순, 필터링할 필드를 클라이언트에게서 받습니다.`,
    }),
    ApiResponse({
      status: 200,
      description: '멘토 리스트 성공적으로 불러옴.',
      schema: {
        properties: {
          contents: {
            type: 'object',
            $ref: getSchemaPath(MentorPaginationResponseDto),
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: '400 error',
      content: {
        JSON: {
          examples: {
            'validation failed': {
              value: {
                message: [
                  'id must be an integer number',
                  'id must not be less than 1',
                  'name must be an string',
                  'activityCategoryId must be an integer number',
                  'activityCategoryId must not be less than 1',
                  'orderField must be one of the following values: id, name, rank, activityCategoryId',
                  'sortOrder must be one of the following values: DESC, ASC',
                  'page must be an integer number',
                  'page must not be less than 1',
                  'pageSize must not be less than 1',
                  'pageSize must be an integer number',
                  'property [허용하지 않은 데이터] should not exist',
                ],
                error: 'Bad Request',
                statusCode: 400,
              },
              description: '유효성 검사 실패',
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: '404 Error',
      content: {
        JSON: {
          examples: {
            'Not Found category Id': {
              value: {
                message: ['해당 category id가 존재하지 않습니다.'],
                error: 'Not Found',
                statusCode: 404,
              },
              description: '카테고리 id 못찾음',
            },
          },
        },
      },
    }),
    ApiExtraModels(MentorPaginationResponseDto),
  );
}
