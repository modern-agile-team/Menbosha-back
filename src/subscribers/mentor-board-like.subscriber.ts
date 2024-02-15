import { MentorBoardLike } from 'src/boards/entities/mentor-board-like.entity';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import { HotPostsRepository } from 'src/hot-posts/repositories/hot-posts.repository';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class MentorBoardLikeSubscriber
  implements EntitySubscriberInterface<MentorBoardLike>
{
  constructor(
    private readonly hotPostsRepository: HotPostsRepository<MentorBoard>,
  ) {}

  listenTo() {
    return MentorBoardLike;
  }

  async afterInsert(event: InsertEvent<MentorBoardLike>): Promise<void> {
    const { existBoard } = event.queryRunner.data;

    if (existBoard.mentorBoardLikes.length === 10 && !existBoard.popularAt) {
      event.manager
        .getRepository(MentorBoard)
        .update({ id: existBoard.id }, { popularAt: new Date() });
    }

    console.log(event.entity);
  }
}
