import { applyDecorators } from '@nestjs/common';
import {
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiGetAllComment() {
  return applyDecorators(
    ApiOperation({
      summary: '보드ID에 맞는 댓글을 불러오는 API',
      description: '보드ID에 맞는 댓글을 불러오는 API',
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 댓글을 불러온 경우',
      content: {
        JSON: {
          example: [
            {
              id: 1,
              content: '댓글 1',
              commentowner: '이 댓글을 작성한 사용자인지 판별해서 true/false값',
              userId: {
                name: '이승우',
                userImage: {
                  id: '이미지 id',
                  userId: '유저 id',
                  imageUrl:
                    'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_640x640.jpg',
                },
              },
              reComment: ['없는 경우 빈 배열'],
            },
            {
              id: 2,
              content: '댓글 2',
              commentowner: '이 댓글을 작성한 사용자인지 판별해서 true/false값',
              userId: {
                name: '이승우',
                userImage: {
                  id: '이미지 id',
                  userId: '유저 id',
                  imageUrl:
                    'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_640x640.jpg',
                },
              },
              reComment: ['없는 경우 빈 배열'],
            },
            {
              id: 3,
              content: '댓글 1차시도',
              commentowner: '이 댓글을 작성한 사용자인지 판별해서 true/false값',
              userId: {
                name: '이승우',
                userImage: {
                  id: '이미지 id',
                  userId: '유저 id',
                  imageUrl:
                    'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_640x640.jpg',
                },
              },
              reComment: ['없는 경우 빈 배열'],
            },
            {
              id: 4,
              content: '댓글 1차시도',
              commentowner: '이 댓글을 작성한 사용자인지 판별해서 true/false값',
              userId: {
                name: '이승우',
                userImage: {
                  id: '이미지 id',
                  userId: '유저 id',
                  imageUrl:
                    'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_640x640.jpg',
                },
              },
              reComment: ['없는 경우 빈 배열'],
            },
            {
              id: 5,
              content: '댓글 5',
              commentowner: '이 댓글을 작성한 사용자인지 판별해서 true/false값',
              userId: {
                name: '이승우',
                userImage: {
                  id: '이미지 id',
                  userId: '유저 id',
                  imageUrl:
                    'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_640x640.jpg',
                },
              },
              reComment: ['없는 경우 빈 배열'],
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '우리 서비스의 액세스 토큰이 아닌 경우',
      content: {
        JSON: {
          example: { statusCode: 401, message: '유효하지 않은 토큰입니다.' },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: '만료된 액세스 토큰인 경우',
      content: {
        JSON: {
          example: { statusCode: 403, message: '만료된 토큰입니다.' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'DB에서 보드를 찾을 수 없는 경우',
      content: {
        JSON: {
          example: { statusCode: 404, message: '보드를 찾을 수 없습니다.' },
        },
      },
    }),
    ApiResponse({
      status: 411,
      description: '액세스 토큰이 제공되지 않은 경우',
      content: {
        JSON: {
          example: { statusCode: 411, message: '토큰이 제공되지 않았습니다.' },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: '댓글을 불러오는 중 오류가 발생한 경우',
      content: {
        JSON: {
          example: {
            statusCode: 500,
            message: '댓글을 불러오는 중 오류가 발생했습니다.',
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
    ApiParam({
      name: 'boardId',
      description: '댓글을 불러올 보드의 ID',
    }),
  );
}
