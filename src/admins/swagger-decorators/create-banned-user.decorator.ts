import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { BannedUserDto } from 'src/admins/banned-user/dtos/banned-user.dto';

export const ApiCreateBannedUser = () => {
  return applyDecorators(
    ApiOperation({
      summary: '어드민 전용 유저 밴 API',
      description:
        '어드민 권한을 가진 유저만 접근 가능한 API로, 같은 어드민은 밴할 수 없습니다.',
      operationId: 'admin_createBannedUser',
    }),

    ApiCreatedResponse({
      description: `유저를 성공적으로 밴. banned_user 테이블에 로우가 생성됨과 동시에 밴 당한 유저의 status가 inactive 상태로 변경됩니다.
        밴을 당한 유저는 제재가 끝나기 전까지 로그인에 실패합니다.`,
      schema: {
        properties: {
          contents: {
            $ref: getSchemaPath(BannedUserDto),
          },
        },
      },
    }),

    ApiExtraModels(BannedUserDto),
  );
};
