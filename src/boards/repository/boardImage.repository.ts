import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { HelpMeBoardImage } from '../entities/help-me-board-image.entity';
import { CreateHelpMeBoardImageDto } from '../dto/helpMeBoard/create.board-image.dto';

@Injectable()
export class BoardImageRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async saveBoardImage(
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
