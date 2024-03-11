import { HttpStatus } from '@nestjs/common';
import { BannedUserDto } from '@src/admins/banned-user/dtos/banned-user.dto';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { HttpError } from '@src/http-exceptions/type/exception.type';

export class BannedUserException extends HttpException {
  constructor(
    error: HttpError<BannedUserException>,
    bannedUser: BannedUserDto,
  ) {
    const { code } = error;
    super({
      code,
      statusCode: HttpStatus.FORBIDDEN,
      additionalResponse: bannedUser,
    });
  }
}
