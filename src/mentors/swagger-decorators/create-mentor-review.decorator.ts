import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiHeaders,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { MentorReviewDto } from '../dtos/mentor-review.dto';

export function ApiCreateMentorReview() {
  return applyDecorators(
    ApiOperation({
      summary: 'CreateMentorReview',
      description: '멘토에 대한 리뷰를 생성합니다.',
    }),
    ApiResponse({
      status: 201,
      description: '성공적으로 멘토 리뷰가 생성됨.',
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
            'validation failed': {
              value: {
                message: [
                  'createMentorReviewChecklistRequestBodyDto must be a non-empty object',
                  'review must be a string',
                  'createMentorReviewChecklistRequestBodyDto.isGoodWork must be a boolean value',
                  'createMentorReviewChecklistRequestBodyDto.isClear must be a boolean value',
                  'createMentorReviewChecklistRequestBodyDto.isQuick must be a boolean value',
                  'createMentorReviewChecklistRequestBodyDto.isAccurate must be a boolean value',
                  'createMentorReviewChecklistRequestBodyDto.isKindness must be a boolean value',
                  'createMentorReviewChecklistRequestBodyDto.isFun must be a boolean value',
                  'createMentorReviewChecklistRequestBodyDto.isInformative must be a boolean value',
                  'createMentorReviewChecklistRequestBodyDto.isBad must be a boolean value',
                  'createMentorReviewChecklistRequestBodyDto.isStuffy must be a boolean value',
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
    ApiInternalServerErrorResponse({
      description: '500 server error',
      content: {
        JSON: {
          example: {
            message: '멘토 리뷰 생성 중 알 수 없는 서버에러 발생',
            error: 'Internal Server Error',
            statusCode: 500,
          },
        },
      },
    }),
    ApiHeaders([
      {
        name: 'access_token',
        description: '액세스 토큰',
        required: true,
        example: '여기에 액세스 토큰',
      },
    ]),
    ApiExtraModels(MentorReviewDto),
  );
}
