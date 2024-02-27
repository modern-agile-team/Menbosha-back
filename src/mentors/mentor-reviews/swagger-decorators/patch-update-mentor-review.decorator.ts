import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { MentorReviewDto } from '@src/mentors/mentor-reviews/dtos/mentor-review.dto';

export function ApiPatchUpdateMentorReview() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 리뷰 patch update',
      description: '멘토에 대한 리뷰를 수정합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 멘토 리뷰가 업데이트 됨.',
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
            'invalid token': {
              value: { statusCode: 400, message: 'invalid token' },
              description: '유효하지 않은 토큰인 경우',
            },
            'jwt must be provided': {
              value: { statusCode: 400, message: 'jwt must be provided' },
              description: '토큰이 제공되지 않은 경우',
            },
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
                message: [
                  'mentorReviewChecklist must be a non-empty object',
                  'At least one update field must exist.',
                  'review must be a string',
                  'mentorReviewChecklist.isGoodWork must be a boolean value',
                  'mentorReviewChecklist.isClear must be a boolean value',
                  'mentorReviewChecklist.isQuick must be a boolean value',
                  'mentorReviewChecklist.isAccurate must be a boolean value',
                  'mentorReviewChecklist.isKindness must be a boolean value',
                  'mentorReviewChecklist.isFun must be a boolean value',
                  'mentorReviewChecklist.isInformative must be a boolean value',
                  'mentorReviewChecklist.isBad must be a boolean value',
                  'mentorReviewChecklist.isStuffy must be a boolean value',
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
    ApiResponse({
      status: 401,
      description: '401 error',
      content: {
        JSON: {
          examples: {
            'invalid signature': {
              value: { statusCode: 401, message: 'invalid signature' },
              description: '우리 서비스의 토큰이 아닌 경우',
            },
            'jwt expired': {
              value: { statusCode: 401, message: 'jwt expired' },
              description: '만료된 토큰인 경우',
            },
          },
        },
      },
    }),
    ApiForbiddenResponse({
      description: '403 Forbidden Error',
      content: {
        JSON: {
          examples: {
            'Forbidden Error': {
              value: {
                message: '해당 리뷰에 권한이 없습니다.',
                error: 'Forbidden',
                statusCode: 403,
              },
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
    ApiInternalServerErrorResponse({
      description: '500 server error',
      content: {
        JSON: {
          example: {
            message: '멘토 리뷰 업데이트 중 알 수 없는 서버에러 발생',
            error: 'Internal Server Error',
            statusCode: 500,
          },
        },
      },
    }),
    ApiBearerAuth('access-token'),
    ApiExtraModels(MentorReviewDto),
  );
}
