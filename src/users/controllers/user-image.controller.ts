import {
  Controller,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserImageService } from '../services/user-image.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiUploadUserImage } from '../swagger-decorators/upload-user-image.decorator';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';

@Controller('user/image')
@ApiTags('user API')
export class UserImageController {
  constructor(private readonly userImageService: UserImageService) {}

  @ApiUploadUserImage()
  @UseGuards(JwtAccessTokenGuard)
  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImage(
    @GetUserId() userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userImageService.uploadImage(userId, file);
  }
}
