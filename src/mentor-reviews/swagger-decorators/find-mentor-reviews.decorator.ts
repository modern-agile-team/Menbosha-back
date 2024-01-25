import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { MentorReviewsPaginationResponseDto } from '../dtos/mentor-reviews-pagination-response.dto';

export function ApiFindMentorReviews() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 리뷰 pagination 조회',
      description: '멘토에 대한 리뷰를 pagination으로 조회합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 멘토 리뷰 조회.',
      schema: {
        properties: {
          contents: {
            $ref: getSchemaPath(MentorReviewsPaginationResponseDto),
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
            'param internal the mentorId must be a positive integer string': {
              value: {
                message:
                  'param internal the mentorId must be a positive integer string',
                error: 'Bad Request',
                statusCode: 400,
              },
              description: 'path variable의 mentorId가 양의 정수가 아님',
            },
            'validation failed': {
              value: {
                message: [
                  'page must not be less than 1',
                  'page must be an integer number',
                  'pageSize must not be less than 5',
                  'pageSize must be an integer number',
                  'menteeId must be an integer number',
                  'menteeId must not be less than 1',
                  'id must be an integer number',
                  'id must not be less than 1',
                  'orderField must be one of the following values: id, createdAt',
                  'sortOrder must be one of the following values: DESC, ASC',
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
      description: '해딩 멘토를 찾지 못함',
      content: {
        JSON: {
          example: {
            message: '해당 유저를 찾지 못했습니다.',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      },
    }),
    ApiExtraModels(MentorReviewsPaginationResponseDto),
  );
}
