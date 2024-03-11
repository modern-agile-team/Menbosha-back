import { Injectable } from '@nestjs/common';
import { CreateHelpMeBoardImageDto } from '@src/boards/dto/helpMeBoard/create.board-image.dto';
import { CreateMentorBoardImageDto } from '@src/boards/dto/mentorBoard/create.mentor.board.image.dto';
import { HelpMeBoardImage } from '@src/entities/HelpMeBoardImage';
import { MentorBoardImage } from '@src/entities/MentorBoardImage';
import { EntityManager } from 'typeorm';

@Injectable()
export class BoardImageRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async saveHelpMeBoardImage(
    boardImage: CreateHelpMeBoardImageDto,
  ): Promise<HelpMeBoardImage> {
    const newBoardImage = new HelpMeBoardImage();
    newBoardImage.helpMeBoardId = boardImage.helpMeBoardId;
    newBoardImage.imageUrl = boardImage.imageUrl;
    const savedImage = await this.entityManager.save(
      HelpMeBoardImage,
      newBoardImage,
    );
    return savedImage;
  }

  saveMentorBoardImage(
    boardImage: CreateMentorBoardImageDto,
  ): Promise<MentorBoardImage> {
    return this.entityManager.save(MentorBoardImage, {
      ...boardImage,
    });
  }

  async getBoardImages(boardId: number): Promise<HelpMeBoardImage[]> {
    return this.entityManager.find(HelpMeBoardImage, {
      where: { helpMeBoardId: boardId },
    });
  }

  async deleteImages(imagesToDelete: HelpMeBoardImage[]): Promise<void> {
    const imageIds = imagesToDelete.map((image) => image.id);
    await this.entityManager.delete(HelpMeBoardImage, imageIds);
  }
}
