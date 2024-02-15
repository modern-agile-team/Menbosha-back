import { MentorBoardLike } from 'src/boards/entities/mentor-board-like.entity';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';

@EventSubscriber()
export class MentorBoardLikeSubscriber
  implements EntitySubscriberInterface<MentorBoardLike>
{
  listenTo() {
    return MentorBoardLike;
  }

  async afterInsert(event: InsertEvent<MentorBoardLike>): Promise<void> {
    const { existBoard } = event.queryRunner.data;

    if (
      existBoard.mentorBoardLikes.length + 1 === 10 &&
      !existBoard.popularAt
    ) {
      await event.manager
        .getRepository(MentorBoard)
        .update({ id: existBoard.id }, { popularAt: new Date() });
    }
  }

  async afterRemove(event: RemoveEvent<MentorBoardLike>): Promise<void> {
    const { existBoard } = event.queryRunner.data;

    if (existBoard.mentorBoardLikes.length - 1 === 9 && existBoard.popularAt) {
      await event.manager
        .getRepository(MentorBoard)
        .update({ id: existBoard.id }, { popularAt: null });
    }
  }
}
