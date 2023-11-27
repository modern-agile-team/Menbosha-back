import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BoardImage } from '../entities/mentor-board-image.entity';
import { CreateBoardImageDto } from '../dto/create.board-image.dto';

@Injectable()
export class BoardImageRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async saveBoardImage(boardImage: CreateBoardImageDto): Promise<BoardImage> {
    const newBoardImage = new BoardImage();
    newBoardImage.boardId = boardImage.boardId;
    newBoardImage.imageUrl = boardImage.imageUrl;
    const savedImage = await this.entityManager.save(BoardImage, newBoardImage);
    return savedImage;
  }
  async getBoardImages(boardId: number): Promise<BoardImage[]> {
    return this.entityManager.find(BoardImage, { where: { boardId } });
  }

  async deleteImages(imagesToDelete: BoardImage[]): Promise<void> {
    const imageIds = imagesToDelete.map((image) => image.id);
    await this.entityManager.delete(BoardImage, imageIds);
  }
}
