import {
  Controller,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserImageService } from '../services/user-image.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiUpdateUserImage } from '../swagger-decorators/update-user-image.decorator';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { AccessTokenAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('user/image')
@ApiTags('user API')
export class UserImageController {
  constructor(private readonly userImageService: UserImageService) {}

  @ApiBearerAuth('access-token')
  @ApiUpdateUserImage()
  @UseGuards(AccessTokenAuthGuard)
  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  async updateUserImage(
    @GetUserId() userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userImageService.updateImage(userId, file);
  }
}
