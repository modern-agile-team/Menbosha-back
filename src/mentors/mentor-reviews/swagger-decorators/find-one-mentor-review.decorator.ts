import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { MentorReviewDto } from '@src/mentors/mentor-reviews/dtos/mentor-review.dto';

export function ApiFindOneMentorReview() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 리뷰 상세 조회',
      description: '멘토에 대한 리뷰 상세 조회합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 멘토 리뷰 상세 조회.',
      schema: {
        properties: {
          contents: {
            $ref: getSchemaPath(MentorReviewDto),
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
            'param internal the reviewId must be a positive integer string': {
              value: {
                message:
                  'param internal the reviewId must be a positive integer string',
                error: 'Bad Request',
                statusCode: 400,
              },
              description: 'path variable의 reviewId가 양의 정수가 아님',
            },
            'validation failed': {
              value: {
                message: ['property [허용하지 않은 데이터] should not exist'],
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
      description: '404 Not Found Error',
      content: {
        JSON: {
          examples: {
            'Not Found User': {
              value: {
                message: '해당 유저를 찾지 못했습니다.',
                error: 'Not Found',
                statusCode: 404,
              },
            },
            'Not Found Review': {
              value: {
                message: '해당 멘토에 대한 리뷰를 찾을 수 없습니다.',
                error: 'Not Found',
                statusCode: 404,
              },
            },
          },
        },
      },
    }),
    ApiExtraModels(MentorReviewDto),
  );
}
