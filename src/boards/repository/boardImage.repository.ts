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
    const newHelpMeBoardImage = new HelpMeBoardImage();
    newHelpMeBoardImage.helpMeBoardId = boardImage.helpMeBoardId;
    newHelpMeBoardImage.imageUrl = boardImage.imageUrl;
    const savedImage = await this.entityManager.save(
      HelpMeBoardImage,
      newHelpMeBoardImage,
    );
    return savedImage;
  }

  async saveMentorBoardImage(
    boardImage: CreateMentorBoardImageDto,
  ): Promise<MentorBoardImage> {
    const newMentorBoardImage = new MentorBoardImage();
    newMentorBoardImage.mentorBoardId = boardImage.mentorBoardId;
    newMentorBoardImage.imageUrl = boardImage.imageUrl;
    const savedImage = await this.entityManager.save(
      MentorBoardImage,
      newMentorBoardImage,
    );
    return savedImage;
  }

  async getHelpMeBoardImages(boardId: number): Promise<HelpMeBoardImage[]> {
    return this.entityManager.find(HelpMeBoardImage, {
      where: { helpMeBoardId: boardId },
    });
  }

  async getMentorBoardImages(boardId: number): Promise<MentorBoardImage[]> {
    return this.entityManager.find(MentorBoardImage, {
      where: { mentorBoardId: boardId },
    });
  }

  async deleteHelpMeBoardImages(
    imagesToDelete: HelpMeBoardImage[],
  ): Promise<void> {
    const imageIds = imagesToDelete.map((image) => image.id);
    await this.entityManager.delete(HelpMeBoardImage, imageIds);
  }

  async deleteMentorBoardImages(
    imagesToDelete: MentorBoardImage[],
  ): Promise<void> {
    const imageIds = imagesToDelete.map((image) => image.id);
    await this.entityManager.delete(MentorBoardImage, imageIds);
  }
}
