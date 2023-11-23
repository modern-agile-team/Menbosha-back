import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiSearchUsersByUserName() {
  return applyDecorators(
    ApiOperation({
      summary: '유저 검색 API',
      description: `Query String의 내용에 유저의 닉네임을 입력해서 검색`,
    }),
    ApiResponse({
      status: 200,
      description: '성공적으로 검색한 유저(userName 기준) 조회',
      content: {
        JSON: {
          example: [
            {
              id: 69,
              provider: 'kakao',
              name: '정비호',
              email: 'jjb2643@nate.com',
              gender: 'M',
              admin: false,
            },
          ],
        },
      },
    }),
  );
}
