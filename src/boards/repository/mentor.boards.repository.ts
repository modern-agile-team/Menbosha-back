import { EntityManager } from 'typeorm';
import { MentorBoard } from '../entities/mentor-board.entity';
import { CreateMentorBoardDto } from '../dto/create.mentor.board.dto';
import { Injectable } from '@nestjs/common';
// import { CreateMentorBoardResponseDto } from '../dto/create.metnor.board.response.dto';

@Injectable()
export class MentorBoardRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async createBoard(
    boardData: CreateMentorBoardDto,
    userId: number,
  ): Promise<MentorBoard> {
    console.log(userId);
    console.log(boardData);

    const mentorBoard = new MentorBoard();
    mentorBoard.head = boardData.head;
    mentorBoard.body = boardData.body;
    mentorBoard.categoryId = boardData.categoryId;
    mentorBoard.userId = userId;
    return await this.entityManager.save(MentorBoard, mentorBoard);
    //이 부분 return은 dto로 수정하기
  }

  async findTotalBoards(): Promise<number> {
    return this.entityManager.count(MentorBoard);
  }

  async findPagedBoards(skip: number, limit: number): Promise<MentorBoard[]> {
    return await this.entityManager.find(MentorBoard, {
      relations: ['user', 'user.userImage'],
      skip: skip,
      take: limit,
    });
  }

  async findBoardById(id: number): Promise<MentorBoard> {
    return await this.entityManager.findOne(MentorBoard, {
      relations: ['user', 'user.userImage'],
      where: { id },
    });
  }

  async findMentorBoardById(id: number): Promise<MentorBoard> {
    return await this.entityManager.findOne(MentorBoard, {
      relations: ['user', 'user.userImage'],
      where: { id },
    });
  }

  async updateBoard(
    id: number,
    boardData: Partial<CreateMentorBoardDto>,
  ): Promise<MentorBoard> {
    return await this.entityManager.save(MentorBoard, boardData);
  }

  async deleteBoard(board: MentorBoard): Promise<void> {
    await this.entityManager.remove(MentorBoard, board);
  }
}
