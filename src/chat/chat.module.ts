import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from './schemas/chat-room.schemas';
import { Chat, ChatSchema } from './schemas/chat.schemas';
import { ChatImage, ChatImageSchema } from './schemas/chat-image.schemas';
import { S3Module } from 'src/common/s3/s3.module';
import { ChatRepository } from './repositories/chat.repository';
import { NotificationService } from './services/notification.service';
import { EventsGateway } from './events/events.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: ChatImage.name, schema: ChatImageSchema },
    ]),
    S3Module,
    AuthModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository, NotificationService, EventsGateway],
})
export class ChatModule {}
