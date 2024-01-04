import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { HelpMeBoardImage } from '../entities/help-me-board-image.entity';
import { CreateHelpMeBoardImageDto } from '../dto/helpMeBoard/create.board-image.dto';
import { CreateMentorBoardImageDto } from '../dto/mentorBoard/create.mentor.board.image.dto';

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

  async saveMentorBoardImage(
    boardImage: CreateMentorBoardImageDto,
  ): Promise<MentorBoardImage> {
    const newBoardImage = new MentorBoardImage();
    newBoardImage.mentorBoardId = boardImage.mentorBoardId;
    newBoardImage.imageUrl = boardImage.imageUrl;
    const savedImage = await this.entityManager.save(
      MentorBoardImage,
      newBoardImage,
    );
    return savedImage;
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
