import { Injectable } from '@nestjs/common';
import { CreateHelpMeBoardImageDto } from '@src/boards/dto/helpMeBoard/create.board-image.dto';
import { CreateMentorBoardImageDto } from '@src/boards/dto/mentorBoard/create.mentor.board.image.dto';
import { BoardImageRepository } from '@src/boards/repository/boardImage.repository';
import { MentorBoardService } from '@src/boards/services/mentor.board.service';
import { S3Service } from '@src/common/s3/s3.service';
import { HelpMeBoardImage } from '@src/entities/HelpMeBoardImage';

@Injectable()
export class BoardImagesService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly boardImageRepository: BoardImageRepository,
    private readonly mentorBoardService: MentorBoardService,
  ) {}

  async createHelpMeBoardImages(
    boardId: number,
    files: Express.Multer.File[],
    userId: number,
  ): Promise<CreateHelpMeBoardImageDto[]> {
    const savedImagesArray: CreateHelpMeBoardImageDto[] = [];
    for (const file of files) {
      const uploadedImage = await this.s3Service.uploadImage(
        file,
        userId,
        'HelpMeBoardImages',
      );
      const helpMeBoardImage = new CreateHelpMeBoardImageDto();
      helpMeBoardImage.helpMeBoardId = boardId;
      helpMeBoardImage.imageUrl = uploadedImage.url;
      const savedImage =
        await this.boardImageRepository.saveHelpMeBoardImage(helpMeBoardImage);
      savedImagesArray.push(savedImage);
    }
    return savedImagesArray;
  }

  async createMentorBoardImages(
    boardId: number,
    files: Express.Multer.File[],
    userId: number,
  ): Promise<CreateMentorBoardImageDto[]> {
    const existMentorBoard = await this.mentorBoardService.findOneByOrNotFound({
      where: {
        id: boardId,
      },
    });

    const savedImagesArray: CreateMentorBoardImageDto[] = [];
    for (const file of files) {
      const uploadedImage = await this.s3Service.uploadImage(
        file,
        userId,
        'MentorBoardImages',
      );
      const mentorBoardImage = new CreateMentorBoardImageDto();
      mentorBoardImage.mentorBoardId = existMentorBoard.id;
      mentorBoardImage.imageUrl = uploadedImage.url;

      const savedImage =
        await this.boardImageRepository.saveMentorBoardImage(mentorBoardImage);
      savedImagesArray.push(savedImage);
    }

    return savedImagesArray;
  }

  async updateHelpMeBoardImages(
    boardId: number,
    files: Express.Multer.File[] | undefined,
    userId: number,
    deleteImageUrl: string[],
  ): Promise<any> {
    const existingImages = // boardId에 해당하는 이미지url을 DB에서 불러옵니다.
      await this.boardImageRepository.getBoardImages(boardId);
    const imagesToDelete = existingImages.filter(
      (image) => deleteImageUrl.includes(image.imageUrl), // 불러온 이미지들과 param값 비교
    );
    await this.deleteHelpMeBoardImages(imagesToDelete); //이미지 삭제처리

    // 여기서부터 새로운 이미지 추가
    const newImagesArray: CreateHelpMeBoardImageDto[] = [];
    // 예외처리 files이 없으면 실행되지 않음.
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadedImage = await this.s3Service.uploadImage(
          file,
          userId,
          'BoardImages',
        );
        const boardImage = new CreateHelpMeBoardImageDto();
        boardImage.helpMeBoardId = boardId;
        boardImage.imageUrl = uploadedImage.url;
        const savedImage =
          await this.boardImageRepository.saveHelpMeBoardImage(boardImage);
        newImagesArray.push(savedImage);
      }
    }
    return {
      message: '이미지 업데이트 및 삭제가 성공적으로 처리되었습니다.',
      newImagesArray,
    };
  }
  // 이미지 삭제 수행
  private async deleteHelpMeBoardImages(imagesToDelete: HelpMeBoardImage[]) {
    const s3ToDelete = imagesToDelete.map((image) => {
      const parts = image.imageUrl.split('/');
      const fileName = parts[parts.length - 1]; // S3에서 삭제할 이미지 파일명을 추출합니다.
      console.log(fileName);
      return 'BoardImages/' + fileName;
    });

    // 예외처리 (빈 배열이 아닐때만 삭제요청 하기)
    if (s3ToDelete.length > 0) {
      await this.boardImageRepository.deleteImages(imagesToDelete); // 이미지 삭제 (db)
      await this.s3Service.deleteImage(s3ToDelete.join(',')); // 이미지 삭제 (s3)
    }
  }
}
